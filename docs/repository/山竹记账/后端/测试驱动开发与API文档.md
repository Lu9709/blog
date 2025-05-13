# 测试驱动开发与API文档

可以通过时序图来进行开发。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661601047208-02ca3a5b-9f8e-48ad-9b9e-81f7fa5bb64b.png)

### 测试驱动开发就是先测试再编码
**方法论TDD测试驱动开发**

目前使用的测试库为rspec，由于还要测接口API，需要使用到[RSpec API Doc Generator](https://github.com/zipmark/rspec_api_documentation)在gemfile文件中配置添加`gem 'rspec_api_documentation'`。然后再`bundle`它，`bundle install`。可以按照文档给予的案例，创建`spec/acceptance`，执行命令为`mkdir spec/acceptance`，编辑创建order测试用例`code spec/acceptance/orders_spec.rb`，具体内容详见[链接](https://github.com/Lu9709/mangosteen-back/commit/8ab5a885e1b1edad34af1dc7b169ee4e8f954271)。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "测试items" do
  get "/api/v1/items" do
    example "Listing items" do
      do_request

      expect(status).to eq 200
    end
  end
end
```

然后生成文档`bin/rake docs:generate`，可以在`api/doc`里看到创建文档HTML，使用`npx http-server .`，起一个服务打开页面，可以查看`/api/v1/items`接口的文档内容。

由于用的是官方文档的案例，现在创建验证邮箱code的API的文件，在`spec/acceptance/`目录下创建`validation_codes_spec.rb`文件，编写测试的请求，目前测试请求返回值status设为400的时候则成功。

```ruby
require 'rails_helper'
require 'rspec_api_documentation/dsl'

resource "验证码" do
  post "/api/v1/validation_codes" do
    example "请求发送验证码" do
      do_request

      expect(status).to eq 400
    end
  end
end
```

在`app/models/validation_code.rb`，修改email为必填。

```ruby
class ValidationCode < ApplicationRecord
  validates :email, presence: true
end
```

修改`validation_codes_controller.rb`文件，失败的时候status为400。

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
    code = SecureRandom.random_number.to_s[2..7]
    validation_code = ValidationCode.new email: params[:email],
      kind: 'sign_in', code: code
    if validation_code.save
      render json:{ code: code } , status: 200
    else 
      render json: { errors: validation_code.errors }, status: 400
    end
  end
end
```

### API文档只展示正确示例
为了展示正确的示例，还需要修改接口测试文件，具体内容详见[链接](https://github.com/Lu9709/mangosteen-back/commit/17a986888b65c243ddf8509225f1e6b41a50948a)。

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
      do_request
      expect(status).to eq 200
    end
  end
end 
```

修改后在执行`bin/rake docs:generate`，之后可以在启动的接口页面服务中看到如下的内容。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661607832636-09f23936-4db8-4a13-aa9f-986c448beb75.png)

### 解决请求中的JSON问题
配置`spec_helper.rb`给在请求类型为acceptance的带上请求头参数。

```ruby
require 'rspec_api_documentation'
RspecApiDocumentation.configure do |config|
  config.request_body_formatter = :json
end
RSpec.configure do |config|
  # 配置在每次请求之前如果发现请求的类型是accpetance的就给加上请求头参数
  config.before(:each) do |spec|
    if spec.metadata[:type].equal? :acceptance
      header 'Accept', 'application/json'
      header 'Content-Type', 'application/json'
    end
  end
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.shared_context_metadata_behavior = :apply_to_host_groups
end
```

解决显示为接口文档页面body显示`[binary data]`的问题，[详见issue](https://github.com/zipmark/rspec_api_documentation/issues/456)。

需要创建文件`config/initializers/rspec_api_documentation.rb`，定义`repsonse_body`的`encode`。

```ruby
# 解决响应中的JSON显示二进制内容的issue
module RspecApiDocumentation
  class RackTestClient < ClientBase
    def response_body
      last_response.body.encode("utf-8")
    end
  end
end
```

由于接口发送的验证码是通过邮箱发送的，不应该在接口中展示，则还需要修改`validation_codes_controller.rb`和`validation_codes_spec.rb`。

```ruby
class Api::V1::ValidationCodesController < ApplicationController
  def create
    code = SecureRandom.random_number.to_s[2..7]
    validation_code = ValidationCode.new email: params[:email],
      kind: 'sign_in', code: code
    if validation_code.save
      render status: 200
    else 
      render json: { errors: validation_code.errors }, status: 400
    end
  end
end
```

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
      do_request
      expect(status).to eq 200
      expect(response_body).to eq ' '
    end
  end
end 
```

重新执行rake后可以看到修改后的接口文档，测试接口文档的内容如下所示。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661612151707-95e36044-794b-4405-ae46-8ae0a2d0b4ef.png)![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661612163573-37dfd2e4-ca78-4f2b-9512-c17a402e80b9.png)

