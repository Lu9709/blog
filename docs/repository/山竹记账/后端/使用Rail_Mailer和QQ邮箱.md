# 使用Rail Mailer和QQ邮箱
配置Rail Mailer的内容可以参照[Rail的官网](https://guides.rubyonrails.org/action_mailer_basics.html#what-is-action-mailer-questionmark)。

创建Mailer的脚手架，执行`bin/rails generate mailer User`

然后进行默认配置设置，这里选了自己邮箱进行发送。

```ruby
class ApplicationMailer < ActionMailer::Base
  default from: "919041098@qq.com"
  layout "mailer"
end

```

还需要编辑发送的内容。

```ruby
class UserMailer < ApplicationMailer
  def welcome_email
    mail(to: "919041098@qq.com", subject: 'hi')
  end
end
```

接着可以创建发送Mailer的视图作为模版，在`app/view/user_mailer/`内创建`welcome_email.html.erb`文件。

```ruby
<!DOCTYPE html>
<html>
  <head>
    <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
  </head>
  <body>
    hi
  </body>
</html>
```

但是这样还不行，需要配置邮件服务器，只在开发环境中配置，生产环境中需要配置用户名和密码。

现在`development.rb`中配置，并还需要配置一个服务器，具体可以参照[Action Mailer Configuration for Gmail](https://guides.rubyonrails.org/action_mailer_basics.html)的内容。

```tsx
config.action_mailer.raise_delivery_errors = true
# 开启发送时的报错
config.action_mailer.perform_caching = false
# 是否使用缓存  
```

由于配置的是qq邮箱需要在设置中配置POP3服务，并生成一个授权码。在发送短信之后会得到授权码，然后将其存放在rails的密钥管理中，执行代码`<font style="color:rgb(64, 120, 242);">EDITOR=</font><font style="color:rgb(80, 161, 79);">"code --wait"</font> bin/rails credentials:edit`，然后在编辑内容中输入`email_password`的密码。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661327917529-64ee7476-f8c4-47b1-864a-9d6eac7de834.png)

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661328597492-e7038ab9-fc26-421c-a25f-1c374fbc3e3a.png)

然后继续在`development.rb`中继续配置邮件服务器的内容，使用邮箱密码时使用`Rails.application.credentials.email_password`读取密钥。

```ruby
config.action_mailer.perform_caching = false
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
    address:              'smtp.qq.com',
    port:                 587,
    domain:               'smtp.qq.com',
    user_name:            '919041098@qq.com',
    password:             Rails.application.credentials.email_password,
    authentication:       'plain',
    enable_starttls_auto: true,
    open_timeout:         10,
    read_timeout:         10
  }
```

可以通过测试来判断邮箱是否可以发送，在终端执行`bin/rails console`，进入rail的环境，执行`UserMailer.welcome_email.deliver`，之后可以在邮箱中看到发送成功了。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661329269910-b12a2f13-64db-42c6-a15a-1cbb8119689f.png)

接着因为还需要发送验证码，则需要在`user_mailer.rb`内配置，并在`welcome_email.html.erb`模版中使用传入的code值。

```ruby
class UserMailer < ApplicationMailer
  def welcome_email(code)
    @code = code
    mail(to: "919041098@qq.com", subject: 'hi')
  end
end
```

```ruby
<!DOCTYPE html>
<html>
  <head>
    <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
  </head>
  <body>
    hi <%= @code %>
  </body>
</html>
```

接着可以进行验证，还是执行`bin/rails console`，进入rail环境，执行`UserMailer.welcome_email('222222').deliver`，邮箱中发送的邮件会带上输入的code。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1661329840809-7c9aa872-7991-49b1-aa8b-a5fa6c0ec75b.png)

**补充内容：**

+ 接口风格：REST/RPC/SOAP/GraphQL
+ 接口文档：全面、实时、可用
+ 前端Mock(造假)，调用接口(联调)调试
+ 发布有A/B Test/预发布/灰度发布/直接发布

前后端合作交流，具体如下所示。

![画板](https://cdn.nlark.com/yuque/0/2022/jpeg/2749296/1661331997159-dd83746b-cfd6-46e1-8d8d-15dbf49ed770.jpeg)

