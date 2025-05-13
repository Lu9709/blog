# mock、order、enum
### 测试邮件被发送成功
由于之前只测了是否发送code，并没有全链路测是否发送邮件。

修改`validation_codes_controller.rb`，在保存code的时候调用`UserMailer.welcome_email`的方法。

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
    code = SecureRandom.random_number.to_s[2..7]
    validation_code = ValidationCode.new email: params[:email],
      kind: 'sign_in', code: code
    if validation_code.save
      UserMailer.welcome_email(validation_code.email)
      render status: 200
    else 
      render json: { errors: validation_code.errors }, status: 400
    end
  end
end

```

`user_mailer.rb`修改了`welcome_email`的方法。接口传递的参数email带入，并给带入到邮箱发送验证码邮件。

```ruby
class UserMailer < ApplicationMailer
  def welcome_email(email)
    validation_code = ValidationCode.find_by_email(email)
    @code = validation_code.code
    mail(to: email, subject: '山竹记账验证码')
  end
end
```

接口测试方法中加上对于邮箱发送的验证。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "验证码" do
  post "/api/v1/validation_codes" do
    parameter :email, type: :string
    # 接受一个参数email 类型为 string
    let(:email) { '1@qq.com' }
    # 请求时带上测试用例
    example "请求发送验证码" do
      expect(UserMailer).to receive(:welcome_email).with(email)
      do_request
      expect(status).to eq 200
      expect(response_body).to eq ' '
    end
  end
end 
```

使用rails console 手动测试email，执行`bin/rails c`，进入控制台的rail环境。创建一个validaton_code，`validation_code = ValidationCode.new email:'919041098@qq.com', kind: 'sign_in',code: '1234'`，然后在数据库保存`validation_code.save`，然后在执行测试API的方法`UserMailer.welcome_email('919041098@qq.com').deliver`。之后可以在邮箱中看到发送的邮件。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661686976317-9cb2af12-b1fb-4c1f-bef9-0111f2a52491.png)

### 重构create_validation_code
rails优化的一个特点是将controller层写的短一点，如果有数据相关的操作尽量写在model层。

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
    validation_code = ValidationCode.new email: params[:email], kind: 'sign_in'
    if validation_code.save
      render status: 200
    else 
      render json: { errors: validation_code.errors }, status: 400
    end
  end
end

```

```ruby
class ValidationCode < ApplicationRecord
  validates :email, presence: true
	# 在创建之前执行 generate_code 方法
  before_create :generate_code
  # 创建之后执行 send_email 方法
  after_create :send_email

  def generate_code
    self.code = SecureRandom.random_number.to_s[2..7]
  end
  def send_email
    UserMailer.welcome_email(self.email)
  end
end
```

由于用户可能会发送多次请求，我们发送的时候需要找到最新发送的一条进行邮箱发送。

```ruby
class UserMailer < ApplicationMailer
  def welcome_email(email)
    validation_code = ValidationCode.order(created_at: :desc).find_by_email(email)
    @code = validation_code.code
    mail(to: email, subject: '山竹记账验证码')
  end
end
```

### rails中使用enum
解决kind的显示问题

```ruby
class ValidationCode < ApplicationRecord
  validates :email, presence: true

   before_create :generate_code
  after_create :send_email

  enum kind: { sign_in: 0, reset_password: 1 }

  def generate_code
    self.code = SecureRandom.random_number.to_s[2..7]
  end
  def send_email
    UserMailer.welcome_email(self.email)
  end
end
```

之后可以在ruby环境下的终端重启一下刚写的代码`reload!`。然后在进行验证`v1 = ValidationCode.new email:'919041098@qq.com', kind: 'sign_in',code: '1234'`，然后答应v1，就可以看到创建的内容，或是通过插件查看整个表，如下所示。若是要清空数据库可以执行`ValdiationCode.destory_all`。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661689271647-02ea4578-e8eb-46f1-99a0-a110dbb5f175.png)

### 防止重复发送验证码
防止发送验证码太频繁，然后返回429。

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
    # 写法一
    if ValidationCode.exists?(email: params[:email], kind:'sign_in',created_at: 1.minute.ago..Time.now)
      render status: :too_many_requests
      return
    end
    # 写法二
    # return render status: :too_many_requests if ValidationCode.exists?(email: params[:email], kind:'sign_in',created_at: 1.minute.ago..Time.now)
    validation_code = ValidationCode.new email: params[:email], kind: 'sign_in'
    if validation_code.save
      render status: 200
    else 
      render json: { errors: validation_code.errors }, status: 400
    end
  end
end
```

接口测试中就直接在后面在做一次请求，期待返回的status为429。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "验证码" do
  post "/api/v1/validation_codes" do
    parameter :email, type: :string
    # 接受一个参数email 类型为 string
    let(:email) { '1@qq.com' }
    # 请求时带上测试用例
    example "请求发送验证码" do
      expect(UserMailer).to receive(:welcome_email).with(email)
      do_request
      expect(status).to eq 200
      expect(response_body).to eq ' '
      do_request
      expect(status).to eq 429
    end
  end
end
```

由于需要区分两种测试，分别是requests和acceptance目录下的测试。需要删除掉无用的测试用例代码，然后终端执行`rspec`，没有报错则为成功。详细代码内容可见[链接](https://github.com/Lu9709/mangosteen-back/commit/21c59bf8de6a48941332c184e5c32dc336645fe9)。

