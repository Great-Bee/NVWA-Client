# NVWA-Client NVWA的客户端代码库

## 一分钟建立NVWA客户端

1. 安装[Nginx](http://nginx.org/en/download.html)

2. 下载源代码
```bash
git clone git://github.com/Great-Bee/NVWA-Client
```
3. 配置nginx.conf
```bash
server {
  listen 80;
  server_name localhost;
  #charset koi8-r;
  #access_log logs/host.access.log main;
  location /nvwa/ {
    proxy_pass http://developer.greatbee.com:8080/nvwa/; 
    proxy_redirect default ;
  }
  location /nvwaUser/ {
    proxy_pass http://developer.greatbee.com:8080/nvwaUser/; 
    proxy_redirect default ;
  }
  location /nvwaSecurity/ {
    proxy_pass http://developer.greatbee.com:8080/nvwaSecurity/; 
    proxy_redirect default ;
  }
  location / {
    root /path/to/nvwa-client/home; #本地NVWA-Client的源代码路径
    index index.html index.htm;
  }
}
```
