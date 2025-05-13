# Axios封装

### 前端：Axios封装
为什么要封装Axios？

因为Axios封装可以做到：

1. 中间层 httpClient
2. 错误处理
3. 可以添加加载中，全局loading
4. 权限处理
5. 统一处理Token，Refresh Token

构造了一个`Http`的类，然后在写了`CRUD`的几个方法。它们都接受一个泛型，用于处理响应后的返回值的类型。这边的`config`进行了处理，使用`Omit`剔除了`AxiosRequestConfig`类型的几个属性。

```typescript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
type JSONValue =  string | number | null | boolean | JSONValue[] | { [key: string]: JSONValue };

export class Http {
  instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL })
  }
  // read
  get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'get' })
  }
  // create
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' |'data' | 'method'>) {
    return this.instance.request<R>({ ...config, url: url, params: data, method: 'post' })
  }
  // update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data'>) {
    return this.instance.request<R>({ ...config, url: url, params: data, method: 'patch' })
  }
  // destroy
  delete<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'params'>) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
  }
  // CRUD
  // create, read, update, delete
}
export const http = new Http('api/v1')
```

之后的请求不用在输入`'api/v1'`的头部内容了。

### 前端：Axios拦截器的使用
处理响应的错误，若有`error.response`则根据他们的`status`来弹出相对应的错误。

关于Axios的内容，可以查看该[链接](https://juejin.cn/post/6844903569745788941)。

```typescript
http.instance.interceptors.response.use(response => {
  console.log(response)
  return response
}, (error) => {
  if(error.response) {
    const axiosError = error as AxiosError
    if(axiosError.response?.status === 429) {
      alert('你太频繁了')
    }
  }
  throw error
})
```

### 后端：解决email格式错误
1. 写测试用例

```ruby
require 'rails_helper'

RSpec.describe "ValidationCodes", type: :request do
  describe "验证码" do
    it "发送太频繁就会返回429" do
      post '/api/v1/validation_codes', params: { email: '919041098@qq.com' }
      expect(response).to have_http_status(200)
      post '/api/v1/validation_codes', params: { email: '919041098@qq.com' }
      expect(response).to have_http_status(429)
    end
    it "邮件不合法就返回 422" do
      post '/api/v1/validation_codes', params: { email: 'x' }
      expect(response).to have_http_status 422
      json = JSON.parse response.body
      p json
      expect(json['errors']['email'][0]).to eq "is invalid"
    end
  end
end
```

2. 修改`validation_codes_controller.rb`中错误返回status为422。422表示的是请求内容格式不正确，详细内容可见[链接](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/422)。

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
      # 422 请求格式错误
      render json: { errors: validation_code.errors }, status: 422
    end
  end
end
```

2. 修改`app/models/validation_code.rb`，给email参数带上校验参数。

```ruby
class ValidationCode < ApplicationRecord
  validates :email, presence: true

  # email 必须是合法的邮箱地址
  validates :email, format: { with: /\A.+@.+\z/ }
  before_create :generate_code
  after_create :send_email

  enum kind: { sign_in: 0, reset_password: 1 }

  def generate_code
    self.code = SecureRandom.random_number.to_s[2..7]
  end
  def send_email
    UserMailer.welcome_email(self.email).deliver
  end
end
```

修改完代码后执行`rspec spec/requests/api/v1/validation_codes_spec.rb:11`查看是否报错。

### 前端：解决统一错误提示
有的时候后端返回的错误提示是英文，前端可能需要进行处理。创建一个`getFrendlyError.tsx`文件用于存放**英文提示和中文提示的对象**，然后在返回**键值映射的中文提示**。

```typescript
const map: Record<string, string> = {
  'is invalid': '格式不正确'
}
export const getFrendlyError = (error: string) => {
  return map[error] || error
}
```

在`SignInPage.tsx`文件中调用发送验证码的点击函数在捕获报错的时候可以这样处理，如下代码片段所示。

```typescript
 const onError = (error: any) => {
  if (error.response.status === 422) {
    Object.assign(errors, error.response.status)
  }
  throw error
}
const onClickSendValidationCode = async() => {
	const response = await http
  	.post('/api/v1/validation_codes', { email: formData.email })
  	.catch(onError)
  refValidationCode.value.startCount()
}
```

### 后端：报错信息国际化(i18n)
国际化的英文全称是`internationalization`，这个单词的长度为20，所以去掉前后两个字符，可以理解为什么是叫做`i18n`。关于ruby的i18n的配置详细内容可以查看该[链接](https://guides.rubyonrails.org/i18n.html#the-public-i18n-api)。

修改`config/application.rb`，添加上`config.i18n.default_locale = 'zh-CN'`的内容。

然后在创建文件`config/locales/zh-CN.yml`，写是errors的报错对应的中文，其中messges下的是公用的部分，而models下的是针对模块的报错提示的中文。

```ruby
zh-CN:
  activerecord:
    errors:
      messages:
        invalid: 格式不正确
      models:
        validation_code:
          attributes:
            email:
              invalid: 邮件格式不正确
```

然后修改测试用例中匹配的中文提示。

```ruby
require 'rails_helper'

RSpec.describe "ValidationCodes", type: :request do
  describe "验证码" do
    it "发送太频繁就会返回429" do
      post '/api/v1/validation_codes', params: { email: '919041098@qq.com' }
      expect(response).to have_http_status(200)
      post '/api/v1/validation_codes', params: { email: '919041098@qq.com' }
      expect(response).to have_http_status(429)
    end
    it "邮件不合法就返回 422" do
      post '/api/v1/validation_codes', params: { email: 'x' }
      expect(response).to have_http_status 422
      json = JSON.parse response.body
      expect(json['errors']['email'][0]).to eq "邮件格式不正确"
    end
  end
end
```

重新运行测试`rspec spec/requests/api/v1/validation_codes_spec.rb:11`，测试通过后在重新启动本地的服务，远程的服务器需要打包部署。

