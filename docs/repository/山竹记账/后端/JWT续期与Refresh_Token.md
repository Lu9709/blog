# JWT续期与Refresh Token

### 处理JWT过期
JWT过期时间一般设置2～24h，一般时间越短越好，怕被黑客破解。修改user的model层，请求的jwt的时候带上时间。具体可查看JWT的维基百科的[Standard fields](https://en.wikipedia.org/wiki/JSON_Web_Token)内容里有些关于exp的内容。

```ruby
class User < ApplicationRecord
    validates :email, presence: true

    def generate_jwt
        payload = { user_id: self.id,exp: (Time.now + 2.hour).to_i }
        JWT.encode payload, Rails.application.credentials.hmac_secret, 'HS256'
    end

    def generate_auth_header
        {Authorization: "Bearer #{self.generate_jwt}"}
    end
end
```

修改`auto_jwt.rb`的内容，由于有些接口不需要JWT的验证，需要排除在外。并对对JWT失效时添加返回token过期和token无效的响应内容。

```ruby
class AutoJwt
  def initialize(app)
    @app = app
  end
  def call(env)
    # jwt 跳过以下路径
    return @app.call(env) if ['/api/v1/session','/api/v1/validation_codes'].include? env['PATH_INFO']

    header = env['HTTP_AUTHORIZATION']
    jwt = header.split(' ')[1] rescue ''
    begin
      payload = JWT.decode jwt, Rails.application.credentials.hmac_secret, true, { algorithm: 'HS256' } 
    rescue JWT::ExpiredSignature
      return [401, {}, [JSON.generate({reason: 'token expired'})]]
    rescue
      return [401, {}, [JSON.generate({reason: 'token invalid'})]]
    end
    env['current_user_id'] = payload[0]['user_id'] rescue nil
    @status, @headers, @response = @app.call(env)
    [@status, @headers, @response]
  end
end
```

添加测试用例后执行`rspec spec/requests/api/v1/me_spec.rb`

```ruby
require 'rails_helper'
require 'active_support/testing/time_helpers'

RSpec.describe "Me", type: :request do
  include ActiveSupport::Testing::TimeHelpers
  describe "获取当前用户" do
    it "登录后成功获取" do
      user =  User.create email: '919041098@qq.com'
      post '/api/v1/session', params: {email: '919041098@qq.com', code: '123456'}
      expect(response).to have_http_status(200)
      json = JSON.parse response.body
      jwt = json['jwt']

      get '/api/v1/me', headers: {'Authorization': "Bearer #{jwt}"}
      expect(response).to have_http_status(200)
      json = JSON.parse response.body
      expect(json['resource']['id']).to eq user.id
    end
    it "jwt过期" do
      travel_to Time.now - 3.hours
      user1 = User.create email: '1@qq.com'
      jwt = user1.generate_jwt

      travel_back
      get '/api/v1/me', headers: {'Authorization': "Bearer #{jwt}"}
      expect(response).to have_http_status(401)
    end
    it "jwt没过期" do
      travel_to Time.now - 1.hours
      user1 = User.create email: '1@qq.com'
      jwt = user1.generate_jwt

      travel_back
      get '/api/v1/me', headers: {'Authorization': "Bearer #{jwt}"}
      expect(response).to have_http_status(200)
    end
  end
end
```

对于接口未完成，但测试用例报错的案例，可以在it前添加x，跳过测试让其处于pending状态。测试的结果如下图所示。

```ruby
 describe "create" do
    xit "can create an item" do
      expect {
        post '/api/v1/items', params: { amount: 99 }
      }.to change { Item.count }.by 1
      # by是否增1
      expect(response).to have_http_status 200
      json = JSON.parse(response.body)
      expect(json['resources']['id']).to be_an(Numeric)
      expect(json['resources']['amount']).to eq 99
    end
  end
```

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661912885428-b09f1a0f-0c5c-4807-9308-02ef40460465.png)

### RefreshToken是什么
**RefreshToken用于JWT的续期**，举例如果用户登录了服务器返回了一个JWT和RefreshToken，当用户的JWT**过期后**，可以用RefreshToken去请求一个关于refreshJWT的接口，返回一个**新的JWT**。若这个RefreshToken的有效时间为7天(只需要记录创建时间，不用去存取有效时间)，那这段时间可以用做**RefreshToken作为JWT续期的凭证**，如此反复指导RefreshToken失效，用户重新登录。

若用户有多台设备并且去登录，用户每个设备请求回来的JWT和RefreshToken是不同的。若要求用户只能登录三台设备的话，可以通过查看数据库是否有该用户的三个RefreshToken，若有但是用户又要登录一台设备，则可以将用户的RefreshToken时效短的那条数据给删除(即删除创建时间久的)，用户之前的设备则登出了，新设备登入。

JWT是用于**专门做用户认证**的，是有标准的规范的，JWT无法知道用户的登录数量，JWT时间要短以防止黑客破解；RefreshToken适用于做**JWT续期**的，是没有标准的，可以存放在数据库，也可以存在redis，RefreshToken的时间可以长一点，毕竟第一次请求JWT的时候才会有。

RefreshToken的内容有两种选择：

+ 随机数，需要存放在数据库内，可以用于控制用户设备数量登录，只需在数据库表内删除。
+ 生成另一个无状态的JWT，不可以用于控制，只能等时间失效。

### 完善API文档
添加sessions_rspec.rb的接口测试文档。然后重新生成接口文档`bin/rake docs:generate`，在用http-server打开文档`http-server dos/api`。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "会话" do
  post "/api/v1/session" do
    parameter :email, '邮箱', required: true
    parameter :code, '验证码', required: true
    response_field :jwt, '用于验证用户身份的 token'
    let (:email) { '1@qq.com' }
    let (:code) { '123456' }
    example "登录" do
      User.create email: email
      do_request
      expect(status).to eq 200
      json = JSON.parse response_body
      expect(json['jwt']).to be_a String
    end
  end
end
```

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661913565519-bcc9f54f-8245-4a51-9d76-4172c23fe076.png)

### 使用email和code登录
数据库若查找不到该邮箱就直接给它创建好。

```ruby
require 'jwt'
class Api::V1::SessionsController < ApplicationController
  def create
    # 如果测试环境
    if Rails.env.test?
      return render status: :unauthorized if params[:code] != '123456'
    else 
      canSignin = ValidationCode.exists? email: params[:email], code: params[:code], used_at: nil
      return render status: :unauthorized unless canSignin
    end
    user = User.find_or_create_by email: params[:email]
    render status: :ok, json:  { jwt: user.generate_jwt }
  end
end
```

添加新的测试用例。

```ruby
require 'rails_helper'

RSpec.describe "Items", type: :request do
  describe "获取账目" do
  it "首次登录" do 
    post '/api/v1/session', params: {email: '919041098@qq.com', code: '123456'}
    expect(response).to have_http_status(200)
    json = JSON.parse response.body
    expect(json['jwt']).to be_a(String)
  end
end
```

接口测试中去除创建用户的过程，然后重新生成接口测试文档。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "会话" do
  post "/api/v1/session" do
    parameter :email, '邮箱', required: true
    parameter :code, '验证码', required: true
    response_field :jwt, '用于验证用户身份的 token'
    let (:email) { '1@qq.com' }
    let (:code) { '123456' }
    example "登录" do
      do_request
      expect(status).to eq 200
      json = JSON.parse response_body
      expect(json['jwt']).to be_a String
    end
  end
end
```

