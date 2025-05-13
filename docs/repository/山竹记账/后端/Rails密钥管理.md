# Rails密钥管理
### 什么是master.key
即Web应用中的对称加密，即加密用同一个密钥，解密也用同一个密钥。举例JWT加密解密需要一个key1，Sesion ID加密解密需要一个key2。

Rails解决了通过`master.key + keys => encrypted`，`encrypted + master.key => key`。即开发者在临时文件中写好了key，用`master.key`把key加密，得到加密后的文件(.enc)，删除临时文件后，key就无法被查看了，然后rails把`.enc`存到git里，在把master.key排除git。

+ 读取key

打开控制台输入`bin/rails console`或`bin/rails c`，会开启一个rails控制台。然后在控制台内输入`Rails.application.credentials.secret_key_base`，`Rails.application.credentials.[:key]([:key]为keyname)`，查看全部key`Rails.application.credentials.config`。

+ 写key

可以发现key所在的文件会自动销毁，.enc文件自动更新。

创建和编辑密钥：`EDITOR="code --wait" bin/rails credentials:edit`或`EDITOR="vim" bin/rails credentials:edit`

### Rails还支持多环境密钥
命令行`EDITOR="code --wait" rails credentials:edit --environment production`，会得到两个文件`config/credentials/production.key(被加入 .gitignore)`、`config/credentials/production.yml.enc`，然后可以在控制台切换至prod环境查看`RAILS_ENV=production rails c`，`Rails.application.credentials.secret_key_base`。

+ 开发环境

使用`master.key`和`credentials.yml.enc`，`master.key`被`git ignore`。如果`.enc`不被 `git ignore`，那就多人共用`master.key`；如果`.enc` 要被`git ignore`，那就每个人创建自己的`master.key`。

+ 生产环境

使用`production.key`和`production.yml.enc`，`prodcution.key`被`git ignore`，内容写到环境变量，`.env`不被`git ignore`，则读取key代码和开发环境一致。

然后需要将key写到环境变量中，打开`set_up_host.sh`然后在`docker run`命令中间添加`-e RAILS_MASTER_KEY=$RAILS_MASTER_KEY`，然后在宿主机终端运行命令`RAILS_MASTER_KEY=xxxxxxxxxxxxxxx mangosteen_deploy/setup_host.sh`。

#### 解决数据库报错问题
修改`database.yml`文件

```ruby
production:
<<: *default
database: mangosteen_production
username: mangosteen
password: <%= ENV["DB_PASSWORD"] %>
  host: <%= ENV["DB_HOST"] %>
```

更新执行脚本`set_up_host.sh`

```ruby
# setup_host.sh 是启动docker环境
DB_PASSWORD=123456
# 容器密码
container_name=mangosteen-prod-1
# 容器名称

version=$(cat mangosteen_deploy/version)
# 部署版本

echo 'docker build ...'
docker build mangosteen_deploy -t mangosteen:$version
if [ "$(docker ps -aq -f name=^mangosteen-prod-1$)" ]; then
  echo 'docker rm ...'
  docker rm -f $container_name
fi
echo 'docker run ...'
docker run -eDB_HOST=$DB_HOST -e RAILS_MASTER_KEY=$RAILS_MASTER_KEY -e DB_PASSWORD=$DB_PASSWORD -d -p 3000:3000 --network=network1 --name=$container_name mangosteen:$version
echo 'DONE!' 
```

在宿主机执行时候要运行参数`DB_HOST=db-for-mangosteen DB_PASSWORD=123456 RAILS_MASTER_KEY=xxxxxxx mangosteen_deploy/set_up_host.sh`，然后还需要创建数据表`docker exec -it mangosteen-prod-1 bin/rails bash`，`bin/rails db:create db:migrate`。

