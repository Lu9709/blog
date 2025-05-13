# JWT
JWT(JSON、Web、Token)，token可以理解为加密字符串。 关于web上用户的登录功能可以查看[陈皓的文章](https://coolshell.cn/articles/5353.html)。

耳熟能详的登录解决方法为 `Session` + `Cookie`。


**Cookie**属于http的内容，表示服务器给浏览器发送的一个特殊字符(token)。

浏览器每次向同一域名都服务器发送的每一个请求都自动带上这个特殊字符。

<br/>

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661751068082-814a0ed8-ea65-4e0d-af77-dc875099e579.png)


**Session**一般基于cookie实现，如果服务器给客户端发送明文的内容，会被黑客篡改，冒充登录，如果使用用随机数，则不会。

**Session**就是保存在服务器的**内存**或**文件**中，用来做真实内容与密文的对应关系。**Session**需要占用服务器的资源。

<br/>

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661751728943-e4c2f788-8dc6-4899-8595-81735aa0b96e.png)

### JWT的定义
JWT就是将header、payload、signature用点分隔符连接后发送给前端。具体的定义可以查看维基百科的[JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)。JWT是做web认证的。

JWT有三部分组成，分别是

+ header——标识用于生成签名的算法,`{ "alg","HS256","typ":"JWT" }`，用于标识加密格式和类型。
+ payload(body)——包含一组声明，可以存放JSON的内容。
+ siginature(密文)——将私钥、header头和body加密。header和body需要用base64处理，防止出现奇怪的字符。

```ruby
HMAC_SHA256(
  secret,
  base64urlEncoding(header) + '.' +
  base64urlEncoding(payload)
)
```

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661753635153-e33e08b4-35cc-4b8f-aae8-65f3252eaa85.png)

### JWT的用法
请求JWT的时候可能会把自身的内容发给后端，后端明确后再将JWT发送给前端。前端需要**手动去维护**JWT，<font style="color:#E8323C;">将JWT存放在</font>`<font style="color:#E8323C;">localstorage</font>`<font style="color:#E8323C;">里，然后配置一下</font>`<font style="color:#E8323C;">axios</font>`<font style="color:#E8323C;">，让所有请求头的</font>`<font style="color:#E8323C;">header</font>`<font style="color:#E8323C;">的</font>`<font style="color:#E8323C;">Authorization</font>`<font style="color:#E8323C;">带上JWT</font>。在下一次请求的时候服务器会去看`header`头中`Authorization`**是**否有JWT，解码后的内容和服务器发送的内容**是否一致**，一致后在返回数据给前端。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661755825644-b7d6956a-48c8-4ee9-9143-2500a9480c85.png)

### 后端实现JWT
#### 编写测试用例
创建controller，`bin/rails g controller api/v1/sessions_controller`，修改控制器的内容。

```ruby
class Api::V1::SessionsController < ApplicationController
  def create
    # 如果测试环境，code 就永远为 123456
    if Rails.env.test?
      # 直接验证码必须为 123456
    else
      #
    end
  end
end
```

写测试用例。

```ruby
require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "会话" do
    it "登录（创建会话）" do
      post '/api/v1/session', params: { email: '919041098@qq.com', code: '123456'}
      expect(response).to have_http_status(200)
      json = JSON.parse response.body
      expect(json['jwt']).to be_a(String)
    end
  end
end
```

#### 实现登录接口
条件是发送过email和code，code未被使用即used_at为空。由于rails是没有JWT的，需要引入库，这边先写死。

```ruby
class Api::V1::SessionsController < ApplicationController
  def create
    # 如果测试环境
    if Rails.env.test?
      return render status: :unauthorized if params[:code] != '123456'
    else 
      canSignin = ValidationCode.exists? email: params[:email], code: params[:code], used_at: nil
      # unless 如果不存在则返回
      return render status: :unauthorized unless canSignin
    end
    user = User.find_by_email params[:email]
    # 数据库中找不到email的话
    if user.nil?
      render status: :not_found, json: {error: '用户不存在'}
    else 
      render status: :ok, json: {
        jwt: 'xxxxxxxx'
      }
    end
    
  end
end
```

```ruby
require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "会话" do
    it "登录（创建会话）" do
      # 默认创建一个邮箱
      User.create email: '919041098@qq.com'
      post '/api/v1/session', params: {email: '919041098@qq.com', code: '123456'}
      # 期待状态码为200
      expect(response).to have_http_status(200)
      json = JSON.parse response.body
      # 期待json中的jwt为字符串
      expect(json['jwt']).to be_a(String)
    end
  end
end
```

#### 实现JWT encode
安装`jwt`的库，详细内容见[链接](https://github.com/jwt/ruby-jwt)。在gemfile文件中添加`gem 'jwt'`，然后执行`bundle install`，可以用浏览器的`window.atob()`来解密base64。网站[Online UUID Generator](https://www.uuidgenerator.net/version4)生成一个随机数用作`hmac_sercet`的密钥，执行`EDITOR="code --wait" bin/rails credentials:edit`，填入`hmac_sercet`密钥保存。然后通过`Rails.application.credentials.hmac_secret`来使用密钥。

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
    user = User.find_by_email params[:email]
    if user.nil?
      render status: :not_found, json: {error: '用户不存在'}
    else
      payload = { user_id: user.id }
      token = JWT.encode payload, Rails.application.credentials.hmac_secret, 'HS256'
      render status: :ok, json: {
        jwt: token
      }
    end
    
  end
end
```

#### 用户接口测试用例
对创建好的jwt进行解密，执行`bin/rails g controller api/v1/mes_controller`，编写测试用例。

```ruby
class Api::V1::MesController < ApplicationController
  def show
  	head 500
  end
end
```

```ruby
require 'rails_helper'

RSpec.describe "Me", type: :request do
  describe "获取当前用户" do
    it "登录后成功获取" do
      # 发送获取邮箱code 得到jwt
      user =  User.create email: '919041098@qq.com'
      post '/api/v1/session', params: {email: '919041098@qq.com', code: '123456'}
      json = JSON.parse response.body
      jwt = json['jwt']
    	# 下次请求时请求头带上jwt Bearer为约定内容
      request.headers["Authorization"] = "Bearer #{jwt}"
      # 解密验证是否为同一个用户的id
      get '/api/v1/me' 
      expect(response).to have_http_status(200)
      json = JSON.parse response.body
      expect(json['resource']['id']).to eq user.id
    end
  end
end 
```

#### 实现JWT decode
对jwt的内容进行解密，还需要对数据进行try/catch处理，判断数据是否为空。`rescue`叫挽救，类似于`try/catch`，若出现报错则替换。

```ruby
class Api::V1::MesController < ApplicationController
  def show
    # get jwt from header
    header = request.headers["Authorization"]
    jwt = header.split(' ')[1] rescue ''
    # decode jwt
    payload = JWT.decode jwt, Rails.application.credentials.hmac_secret, true, { algorithm: 'HS256' } rescue nil
    return head 400 if payload.nil?
    # get user_id from payload
    user_id = payload[0]['user_id'] rescue nil
    # get user from user_id
    user = User.find user_id
    return head 404 if user.nil?
    # render user
    render json: { resource: user }
  end
end
```

本章内容的代码，详见[链接](https://github.com/Lu9709/mangosteen-back/commits/main)。

