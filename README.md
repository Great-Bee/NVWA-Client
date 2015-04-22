# NVWA-Client NVWA的客户端代码库

## 一分钟建立NVWA客户端

a. 安装[Nginx](http://nginx.org/en/download.html)

b. 下载源代码
```bash
git clone git://github.com/Great-Bee/NVWA-Client
```
c. 配置nginx.conf
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

其它
-如果要搭建NVWA服务端，可以去[NVWA-Server](https://github.com/Great-Bee/NVWA-Server)
-如果要测试NVWA的内核，可以去[NVWA-Test](https://github.com/Great-Bee/NVWA-Test)
