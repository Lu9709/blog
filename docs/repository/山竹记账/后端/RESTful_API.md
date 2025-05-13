# Restful API
### 解决Docker依赖持久化问题
重新`rebuild`后项目跑不起来，因为依赖没有被持久化。

解决持久化需要在修改`/workspaces/oh-my-env/.devcontainer/Dockerfile`文件添加`RUN yes | pacman -S postgresql-libs`（其实是假的持久化是在重新rebuild后重新安装），并在`/workspaces/oh-my-env/.devcontainer/devcontainer.json`添加 `"source=gems,target=/usr/local/rvm/gems,type=volume"`

重启后可能需要重新开启数据库`docker start 数据库名`，或者手动在docker的Volume中重启数据库。

### REST
REST即REpresentational State Transfer，是一种网络软件架构风格（Roy于2000年在博士论文中提出，曾撰写HTTP规格文档）

一般以**资源**为中心，充分利用**HTTP现有功能**，如动词、状态码、头部字段。可以适当违反规则。具体可以参考[GithubAPI](https://docs.github.com/cn/rest)。

+ 看见**路径**就知道请求什么东西
+ 看见**动词**就知道是什么操作
+ 看见**状态码**就知道结果是什么

举例：200 - 成功 ，201 - 创建成功，404 - 未找到，403 - 没有权限，401 - 未登陆，422 - 无法处理，参数有问题，402 - 需付费，412 - 不满足前提条件，429 - 请求太频繁，400 - 其他所有错误。详细原因可以放在body里，具体状态码可见[MDN-HTTP响应状态](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)。

举例如下：

1. 请求1：创建 item

`POST /api/v1/items`

`Content-Type: application/json`

消息体 `{"amount":99, "kind": "income"}`

响应 `{"resource": {...}} 或 {"errors": {...}}`

2. 请求2：创建 item

`POST /api/v1/items`

`Content-Type: application/x-www-form-urlencoded`

消息体 `amount=99&kind=income`

3. 请求3：更新 item

`PATCH /api/v1/items/1`

`Content-Type: application/json`

消息体 `{"amount":"11", "kind": "expense"}`

4. 请求4：删除 itemDELETE 

`/api/v1/items/1`

5. 请求：获取一个或多个 item

`GET /api/v1/items/1`

`GET /api/v1/items?page=1&per_page=10`

### API概要设计
#### 发送验证码
资源：validation_code<u>s</u>

动作：create（POST）

状态码：200 ｜ 201 ｜ 422 ｜ 429

#### 登入登出
资源：session

动作：create ｜ destory（DELETE）

状态码：200 ｜ 422

#### 当前用户
资源：me

动作：show（GET）

#### 记账的数据
资源：items

动作：create ｜ update ｜show ｜ index ｜destroy

update对应PATCH，表示部分更新

show对应GET /items/:id，用于展示一条记账

index对应GET /items?since=2022-01-01&before=2023-01-01

destory对应DELETE，表示删除，一般为软删除

#### 标签
资源：tags

动作：create ｜ update ｜show ｜ index ｜destroy

#### 打标签
即标签和用户进行关联

资源：taggings（动词的名词形式）

动作：create｜index｜destroy

#### 具体实现
在routers.rb文件内修改，创建路由。

```ruby
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  namespace :api do
    namespace :v1 do
      resources :validation_codes, only: [:create] # only表示仅仅创建该个 exclude 表示创建排除哪个
      resources :session, only: [:create, :destory]
      resources :me, only: [:show]
      resources :items
      resources :tags
    end
  end
end
```

##### 创建model
执行`bin/rails g model ValidationCode email:string kind:string used_at:datetime`，创建ValidationCode的model。

还需打开并修改`migrate/create_validaton_codes.rb`文件，在执行`bin/rails db:migrate`

```ruby
class CreateValidationCodes < ActiveRecord::Migration[7.0]
  def change
    create_table :validation_codes do |t|
      t.string :email
      t.integer :kind, default: 1, null: false
      t.string :code, limit: 100
      t.datetime :used_at

      t.timestamps
    end
  end
end
```

执行`bin/rails g model item user_id:integer amount:integer note:text tags_id:integer happen_at:datetime`，然后在修改`migrate/create_items.rb`，在执行`bin/rails db:migrate`

```ruby
class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.bigint :user_id
      t.integer :amount
      t.text :note
      t.bigint :tags_id, array: true
      t.datetime :happen_at

      t.timestamps
    end
  end
end
```

##### 创建controller
创建ValidationCodes的Controller执行`bin/rails g controller validation_codes create`，删除它创建的路由，在controller文件下创建api/v1文件夹，将创建好的`validation_codes_controller.rb`移动至其下，并修改

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
  end
end
```

创建Items的Controller执行`bin/rails g controller Api::V1::Items`，会自动将路径创建。

##### 实现分页
1. 使用page和per_page参数，见[kaminari](https://github.com/kaminari/kaminari)或[pagy](https://github.com/ddnexus/pagy)库(性能最佳)

安装kaminari，在gemfile文件中添加`gem 'kaminari'`，然后在终端执行`bundle install`，然后在重启服务，若要修改kaminari的config，执行`bin/rails g kaminari:config`，会创建一个kaminari_config文件，可以进行编辑修改。

在`items_controller.rb`进行修改，如下

```ruby
class Api::V1::ItemsController < ApplicationController
    def index
        items = Item.page(params[:page]).per(100)
        render json: { resources: items, pager: {
            page: params[:page]
            per_page: 100,
            count: Item.count
        }}
    end
    def create
        item = Item.new amount: 1
        if item.save
            render json: { resources: item }
        else
            render json: { errors: item.errors }
        end
    end
end
```

可以通过`curl -X POST http:127.0.0.1:3000/api/v1/items`创建Items数据，在通过`curl http:127.0.0.1:3000/api/v1/items`查看分页数据。

2. 使用start_id和limit参数，需要id是自增数字

```ruby
class Api::V1::ItemsController < ApplicationController
    def index
        items = Item.where("id > ?", params[:start_id]).limit(100)
        render json: { resources: items}
    end
    def create
        item = Item.new amount: 1
        if item.save
            render json: { resources: item }
        else
            render json: { errors: item.errors }
        end
    end
end
```

