# migration、自定义校验、ISO8601
### 给数据库添加字段
由于给数据库添加字段需要migration，执行`bin/rails g migration AddKindToItem`，然后添加需要修改的内容。

```ruby
class AddKindToItem < ActiveRecord::Migration[7.0]
  def change
    # 给items表添加一列为kind，类型为integer，默认为1，不能为空
    add_column :items, :kind, :integer, default: 1, null: false
  end
end
```

添加完成后执行`bin/rails db:migrate`，然后查看`/root/repos/mangosteen-1/db/schema.rb`中数据库中的items表接口发生了变化，添加了一列为kind，如下图所示。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1662315688874-45edbb85-3175-42ce-862b-01eb7d65b045.png)

### 自定义校验
然后在修改`app/models/item.rb`的内容，`kind`为一个枚举，表示收入和支出，之后还可以在添加。其中`validates`表示**标准校验**，`validate`表示**<font style="color:#E8323C;">自定义校验</font>**。其中`&`在ruby中可以用于求是否交集，举例`[1,2] & [1,2,3]`会返回交集的内容`[1,2]`，而`!=`和`==`的理解在ruby中又有不同，ruby中是进行了递归，判断值是否相等，和`java`或`JavaScript`中的理解不同。

```ruby
class Item < ApplicationRecord
  enum kind: { expenses: 1, income: 2 }
  validates :amount, presence: true
  validates :kind, presence: true
  validates :happen_at, presence: true
  validates :tags_id, presence: true

  validate :check_tags_id_belong_to_user
  
  def check_tags_id_belong_to_user
    # all_tag_ids = Tag.where(user_id: self.user_id).map(|tag| tag.id)
    # ruby遍历的方法
    all_tag_ids = Tag.where(user_id: self.user_id).map(&:id)
    if self.tags_id & all_tag_ids != self.tags_id
      self.errors.add :tags_id, '不属于当前用户'
    end
  end
end
```

### 测试创建item接口
<br/>tips
**POST /api/v1/items**

<br/>

item的model在此之前已经创建好了，所以**跳过步骤一**。

1. 创建model

运行db:migrate

2. 创建controller

```ruby
class Api::V1::ItemsController < ApplicationController
    def index
        current_user_id = request.env['current_user_id']
        return head :unauthorized if current_user_id.nil?
        items = Item.where({user_id: current_user_id})
            .where({created_at: params[:created_after]..params[:created_before]})
            .page(params[:page])
        render json: { resources: items, pager: {
            page: params[:page] || 1,
            per_page: Item.default_per_page,
            count: Item.count
        } }
    end
    def create
      	# 其中的tags_id 是数组，不是单个值，需要改写成这样，且只能放在最后！！！
        item = Item.new params.permit(:amount, :happen_at, tags_id: [])
        item.user_id = request.env['current_user_id']
        if item.save
            render json: { resources: item }
        else
            render json: { errors: item.errors }, status: :unprocessable_entity
        end
    end
end

```

3. 写测试

由于修改了model层添加了必填项，测试用例重写。测试用例中时间用到了[ISO8601](https://en.wikipedia.org/wiki/ISO_8601)，是分时区的，需要注意。

```ruby
require 'rails_helper'

RSpec.describe "Items", type: :request do
  describe "获取账目" do
    it "分页,未登录" do
      user1 = User.create email: '1@qq.com'
      user2 = User.create email: '2@qq.com'
      11.times { Item.create amount: 100, user_id: user1 }
      11.times { Item.create amount: 100, user_id: user2 }
      get '/api/v1/items'
      expect(response).to have_http_status 401
    end
    it "分页" do
      user1 = User.create email: '1@qq.com'
      user2 = User.create email: '2@qq.com'
      tag1 = Tag.create name: 'tag1', sign: 'x', user_id: user1.id
      tag2 = Tag.create name: 'tag2', sign: 'x', user_id: user2.id
      11.times { Item.create amount: 100, kind: 'expenses', tags_id: [tag1.id], happen_at: '2018-06-18T00:00:00+08:00', user_id: user1.id }
      11.times { Item.create amount: 100, kind: 'expenses', tags_id: [tag2.id], happen_at: '2018-06-18T00:00:00+08:00', user_id: user2.id }
      get '/api/v1/items', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 10
      get '/api/v1/items?page=2', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 1
    end
    it "按时间筛选" do
      user1 = User.create email: '1@qq.com'
      tag = Tag.create name: 'tag', sign: 'x', user_id: user1.id
      item1 = Item.create amount: 100, created_at: '2018-01-02', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00', user_id: user1.id
      item2 = Item.create amount: 100, created_at: '2018-01-02', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00',user_id: user1.id
      item3 = Item.create amount: 100, created_at: '2019-01-01', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00',user_id: user1.id
      get '/api/v1/items?created_after=2018-01-01&created_before=2018-01-03', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 2
      expect(json['resources'][0]['id']).to eq item1.id
      expect(json['resources'][1]['id']).to eq item2.id
    end
    it "按时间筛选（边界条件）" do
      user1 = User.create email: '1@qq.com'
      tag = Tag.create name: 'tag', sign: 'x', user_id: user1.id
      item1 = Item.create amount: 100, created_at: Time.new(2018, 1, 1, 0, 0, 0, "Z"), tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00', user_id: user1.id
      get '/api/v1/items?created_after=2018-01-01&created_before=2018-01-02', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 1
      expect(json['resources'][0]['id']).to eq item1.id
    end
    it "按时间筛选（边界条件2）" do
      user1 = User.create email: '1@qq.com'
      tag = Tag.create name: 'tag', sign: 'x', user_id: user1.id
      item1 = Item.create amount: 100, created_at: '2018-01-01', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00',  user_id: user1.id
      item2 = Item.create amount: 100, created_at: '2017-01-01',  tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00', user_id: user1.id
      get '/api/v1/items?created_after=2018-01-01', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 1
      expect(json['resources'][0]['id']).to eq item1.id
    end
    it "按时间筛选（边界条件3）" do
      user1 = User.create email: '1@qq.com'
      tag = Tag.create name: 'tag', sign: 'x', user_id: user1.id
      item1 = Item.create amount: 100, created_at: '2018-01-01', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00',  user_id: user1.id
      item2 = Item.create amount: 100, created_at: '2019-01-01', tags_id: [tag.id], happen_at: '2018-06-18T00:00:00+08:00',  user_id: user1.id
      get '/api/v1/items?created_before=2018-01-02', headers: user1.generate_auth_header
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources'].size).to eq 1
      expect(json['resources'][0]['id']).to eq item1.id
    end
  end
  describe "创建账目" do
    it '未登录创建' do
      post '/api/v1/items', params: { amount: 100 }
      expect(response).to have_http_status 401
    end
    it "登录后创建" do
      user = User.create email: '1@qq.com'
      tag1 = Tag.create name: 'tag1', sign: 'x', user_id: user.id
      tag2 = Tag.create name: 'tag2', sign: 'x', user_id: user.id
      expect {
        post '/api/v1/items', params: { amount: 99, tags_id: [tag1.id, tag2.id], happen_at: '2018-01-01T00:00:00+08:00'}, headers: user.generate_auth_header
      }.to change { Item.count }.by 1
      # by是否增1
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources']['id']).to be_an(Numeric)
      expect(json['resources']['amount']).to eq 99
      expect(json['resources']['user_id']).to eq user.id
      expect(json['resources']['happen_at']).to eq '2017-12-31T16:00:00.000Z'
    end
    it "创建时 amount、tags_id、happen_at必填" do
      user = User.create email: '1@qq.com'
      post '/api/v1/items', params: {}, headers: user.generate_auth_header
      expect(response).to have_http_status 422
      json = JSON.parse response.body
      expect(json['errors']['amount'][0]).to eq "can't be blank"
      expect(json['errors']['tags_id'][0]).to eq "can't be blank"
      expect(json['errors']['happen_at'][0]).to eq "can't be blank"
    end
  end
end

```

4. 写代码

```ruby
class Api::V1::ItemsController < ApplicationController
    def create
        item = Item.new params.permit(:amount, :tags_id, :happen_at)
        item.user_id = request.env['current_user_id']
        if item.save
            render json: { resources: item }
        else
            render json: { errors: item.errors }, status: :unprocessable_entity
        end
    end
end
```

5. 写文档

其中的`Item.create!`中的`!`表示创建的时候把报错提前显示出来。`(0..1).map{ ... }`表示创建两个`tag`，`(0..1)`可以表示范围，其实相当于数组`[0,1]`。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "账目" do
  let(:current_user) { User.create email: '1@qq.com' }
  let(:auth) { "Bearer #{current_user.generate_jwt}" }
  get "/api/v1/items" do  
    # 验证方式：使用基础验证， 值为auth
    authentication :basic, :auth
    parameter :page, '页码'
    parameter :created_after, '创建时间起点（筛选条件）'
    parameter :created_before, '创建时间终点（筛选条件）'
    with_options :scope => :resources do
      response_field :id, 'ID'
      response_field :amount, '金额（单位：分）'
    end
    let(:created_after) { Time.now - 10.days }
    let(:created_before) { Time.now + 10.days }
    example "获取账目" do
      tag = Tag.create name: "x", sign: "x", user_id: current_user.id
      # ! 用于创建时候将报错提前显示出来
      11.times do Item.create! amount: 100, happen_at: '2022-09-05', tags_id: [tag.id], user_id: current_user.id end
      do_request
      expect(status).to eq 200
      json = JSON.parse response_body
      expect(json['resources'].size).to eq 10
    end
  end
  post "/api/v1/items" do
    authentication :basic, :auth
    parameter :amount, '金额（单位：分）', required: true
    parameter :kind, '类型', required: true, enum: ['expenses', 'income']
    parameter :happen_at, '发生时间', required: true
    parameter :tags_id, '标签列表（只传ID）', required: true
    with_options :scope => :resource do
      response_field :id
      response_field :amount
      response_field :kind
      response_field :happen_at
      response_field :tags_id
    end
    let (:amount) { 9999 }
    let (:kind) { 'expenses' }
    let(:happen_at) { '2020-10-30T00:00:00+08:00' }
    # (0..1).map{...} 表示创建两个tag (0..1)可以表示范围，其实相当于数组[0,1]
    let(:tags) { (0..1).map{Tag.create name: 'x', sign:'x', user_id: current_user.id} }
    let(:tags_id) { tags.map(&:id) }
    let(:happen_at) { '2020-10-30T00:00:00+08:00' }
    example "创建账目" do
      do_request
      expect(status).to eq 200
      json = JSON.parse response_body
      expect(json['resources']['amount']).to eq amount
    end
  end
end
```

修改好API文档后，执行`bin/rake docs:generate`更新API文档，然后执行`http-server doc/api`进行查看API文档内容。

