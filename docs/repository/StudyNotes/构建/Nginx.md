# Nginx

> Nginx 是**一个高性能的 Web 服务器、反向代理服务器、负载均衡器和HTTP缓存**，也可以作为 **邮件代理服务器** 和 **通用 TCP/UDP 代理服务器**。
>
> 它由俄罗斯程序员 Igor Sysoev 开发，最初发布于 2004 年，旨在解决 C10K 问题（即单台服务器同时处理 1 万个连接的性能挑战）。

### 核心功能

1. **Web 服务器**：Nginx 可以作为 Web 服务器，处理静态文件和动态请求。

2. **反向代理**：Nginx 可以作为反向代理服务器，将客户端请求转发给后端服务器。

3. **负载均衡**：Nginx 可以实现负载均衡，将请求分发到多个后端服务器，提高系统的吞吐量和可用性。

4. **HTTP缓存**：Nginx 可以缓存静态文件和动态内容，减少后端服务器的负载，提高响应速度。

5. **SSL/TLS 支持**：Nginx 可以处理 SSL 加密的请求，将加密流量解密后发送给后端服务器。

6. **URL重写与重定向**：Nginx 可以通过 URL 重写功能将客户端请求重定向到其他 URL。


### 安装 nginx

#### window

访问 Nginx 官方网站 [nginx.org](http://nginx.org/)，在 Download 区域选择适合 Windows 的版本下载。

#### macOS

可以通过 `brew` 命令进行安装， `brew install nginx` 安装 nginx，还可以通过 `brew info nginx` 查看 nginx 的安装信息。


#### 基本命令

| 命令 | 描述 ｜
| --- | --- |
| `nginx` | 启动 nginx 服务 |
| `nginx -s stop` | 停止 nginx 服务 |
| `nginx -s reload` | 重新加载 nginx 配置文件 |
| `nginx -s reopen` | 重新打开 nginx 日志文件 |
| `nginx -s quit` | 平滑停止 nginx 服务 |
| `nginx -t` | 测试 nginx 配置文件是否正确 |
| `nginx -v` | 查看 nginx 版本信息 |
| `nginx -h` | 查看 nginx 帮助信息 |
| `nginx -p <path>` | 指定 nginx 配置文件的路径 |
| `nginx -c <file>` | 指定 nginx 配置文件的名称 |
| `nginx -g <directive>` | 全局配置指令 |
| `nginx -t -c <file>` | 测试指定的 nginx 配置文件是否正确 |
| `nginx -s <signal>` | 发送信号给 nginx 进程 |
| `nginx -p <path> -c <file>` | 指定 nginx 配置文件的路径和名称 |
| `nginx -k <signal>` | 发送信号给 nginx 主进程 |
| `nginx -s <signal> -p <path> -c <file>` | 发送信号给指定的 nginx 进程 |

要获取所有正在运行的 nginx 进程的列表，可以使用 ps 工具，例如，以下方式：

```bash
ps aux | grep nginx
```

然后可以通过查看主进程ID号，中断nginx进程。

```bash
kill -s QUIT <PID>
```

###  Nginx 配置文件

Nginx 的行为由配置文件控制，主要配置文件是 `/etc/nginx/nginx.conf`，该文件包含了 Nginx 的全局配置和多个服务器块的配置。

每个服务器块可以配置多个监听端口和域名，以及反向代理、负载均衡、缓存等功能。

如下为一个完整的 Nginx 配置文件示例：

::: code-group
```text [文件结构]
/etc/nginx/
├── nginx.conf          # 主配置文件 (即上面的内容)
├── ssl/
│   ├── fullchain.pem   # 完整证书链 (证书 + 中间证书)
│   ├── privkey.pem     # 私钥文件
│   └── chain.pem       # 中间证书
└── sites-enabled/      # 推荐存放 server 块配置
```

```nginx [nginx.conf]
# 全局配置
user nginx;                        # 使用 nginx 用户运行
worker_processes auto;             # 自动根据 CPU 核心数设置 worker 数量
error_log /var/log/nginx/error.log warn;  # 错误日志路径和级别
pid /var/run/nginx.pid;            # PID 文件位置

# 事件模块
events {
    worker_connections 1024;       # 每个 worker 最大连接数
    multi_accept on;               # 同时接受多个连接
    use epoll;                     # Linux 高效事件模型
}

# HTTP 模块
http {
    # 基础设置
    include /etc/nginx/mime.types; # MIME 类型映射
    default_type application/octet-stream; # 默认 MIME 类型
    charset utf-8;                 # 默认字符集
    server_tokens off;             # 隐藏 Nginx 版本号（安全）
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main; # 访问日志路径

    # 性能优化
    sendfile on;                   # 启用高效文件传输
    tcp_nopush on;                # 优化数据包发送
    tcp_nodelay on;               # 禁用 Nagle 算法
    keepalive_timeout 65;         # 连接保持时间
    keepalive_requests 1000;      # 单连接最大请求数
    client_max_body_size 20m;     # 最大上传文件大小

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;            # 压缩级别 (1-9)
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;         # 最小压缩文件大小
    gzip_disable "msie6";         # 禁用旧版 IE

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3; # 只允许现代协议
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;              # OCSP 装订
    ssl_stapling_verify on;
    resolver 8.8.8.8 1.1.1.1 valid=300s; # DNS 解析器

    # 缓存路径
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

    # 默认服务器配置 (HTTP 重定向到 HTTPS)
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;             # 匹配所有域名
        
        # 重定向到 HTTPS
        return 301 https://$host$request_uri;
    }

    # 主服务器配置 (HTTPS)
    server {
        listen 443 ssl http2;      # 启用 HTTP/2
        listen [::]:443 ssl http2;
        server_name example.com www.example.com; # 你的域名
        
        # SSL 证书配置
        ssl_certificate /etc/nginx/ssl/fullchain.pem;     # 证书链
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;   # 私钥
        ssl_trusted_certificate /etc/nginx/ssl/chain.pem; # 中间证书
        
        # 安全头设置
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.example.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data:; font-src 'self' fonts.gstatic.com; connect-src 'self' api.example.com; frame-src none; object-src 'none';" always;
        
        # 根目录设置
        root /usr/share/nginx/html; # 前端文件存放目录
        index index.html;
        
        # 前端路由处理 (SPA 应用必需)
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # 静态资源缓存
        location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
            expires 1y;             # 1年缓存
            add_header Cache-Control "public, immutable";
            access_log off;          # 关闭访问日志
        }
        
        # API 代理配置
        location /api/ {
            proxy_pass http://backend:8000/; # 后端服务地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # 代理缓存设置
            proxy_cache STATIC;
            proxy_cache_valid 200 1h; # 成功响应缓存1小时
            proxy_cache_use_stale error timeout updating;
        }
        
        # WebSocket 支持
        location /ws/ {
            proxy_pass http://backend:8000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
        
        # 健康检查端点
        location /health {
            access_log off;
            add_header Content-Type text/plain;
            return 200 "OK";
        }
        
        # 禁止访问隐藏文件
        location ~ /\.(?!well-known) {
            deny all;
            access_log off;
            log_not_found off;
        }
        
        # 错误页面
        error_page 404 /404.html;
        location = /404.html {
            internal;
        }
        
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            internal;
        }
    }
    
    # 子域名重定向 (www 到非 www)
    server {
        listen 443 ssl http2;
        server_name www.example.com;
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        return 301 https://example.com$request_uri;
    }
}
```
:::

#### Nginx 配置前端静态资源

单页面应用必配配置，解决刷新页面404问题。

```nginx
server {
    listen 80;
    server_name example.com;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Nginx 转发 CDN 地址

Nginx 配置反向代理，将请求转发到 CDN 地址，可以防止被直接盗链或攻击、Nginx 可以做二次缓存、限流处理等。

```nginx
server {
    listen 80;
    server_name your-proxy.com;

    # ============ 代理 CDN 资源 ============
    location /static/ {
        # 目标 CDN 地址
        proxy_pass https://cdn.example.com/;

        # 保留原始请求头
        proxy_redirect off;
        proxy_set_header Host cdn.example.com;           # 强制 Host 为 CDN 域名
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        # 启用缓存（可选）：Nginx 本地缓存 CDN 内容
        proxy_cache cdn_cache;
        proxy_cache_valid 200 302 1h;
        proxy_cache_valid 404 10m;
        proxy_cache_use_stale error timeout updating;
    }
}
```




### 参考链接

> [Nginx](https://nginx.org/en/docs/)
>
> [Nginx 入门到精通](https://docs.ffffee.com/nginx/0-nginx%E5%85%A5%E9%97%A8%E5%88%B0%E7%B2%BE%E9%80%9A.html)
> 
> [Nginx 容器教程](https://www.ruanyifeng.com/blog/2018/02/nginx-docker.html)