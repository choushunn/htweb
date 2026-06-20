# 部署指南

> 适用于昊天金属科技企业官网的生产部署

## 目录

1. [环境要求](#1-环境要求)
2. [Docker 部署（推荐）](#2-docker-部署推荐)
3. [手动部署（服务器）](#3-手动部署服务器)
4. [域名和 HTTPS](#4-域名和-https)
5. [数据库备份](#5-数据库备份)
6. [日志和监控](#6-日志和监控)
7. [常见问题](#7-常见问题)

---

## 1. 环境要求

### 生产环境最低配置

| 配置项 | 要求 |
|--------|------|
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 20 GB（SSD 优先） |
| 操作系统 | Ubuntu 20.04+ / CentOS 7+ / Debian 11+ |
| Docker | 24+（如使用 Docker 部署） |
| Node.js | 18+（如手动部署） |
| MySQL | 8.0（如手动部署） |

### 网络端口

| 端口 | 用途 | 是否对外开放 |
|------|------|-------------|
| 80 | HTTP（Nginx 反向代理） | 是 |
| 443 | HTTPS（如需配置 SSL） | 是 |
| 3306 | MySQL | 仅内网 |

---

## 2. Docker 部署（推荐）

### 2.1 克隆代码

```bash
git clone https://github.com/choushunn/htweb.git
cd htweb
```

### 2.2 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 修改 JWT_SECRET 等敏感信息
```

**docker-compose.yml** 已内置默认配置，通常只需修改 `JWT_SECRET`。

### 2.3 一键启动

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看启动日志
docker-compose logs -f

# 等待 MySQL 就绪后（首次部署）初始化数据库
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed
```

### 2.4 验证部署

```bash
# 健康检查
curl http://localhost/api/health
# 预期: {"status":"ok","timestamp":"..."}

# 检查前端
curl -I http://localhost
# 预期: HTTP/1.1 200 OK
```

### 2.5 更新部署

```bash
git pull
docker-compose up -d --build
```

---

## 3. 手动部署（服务器）

### 3.1 数据库配置

```bash
# 安装 MySQL 8.0
sudo apt update
sudo apt install mysql-server-8.0

# 创建数据库
sudo mysql -e "CREATE DATABASE IF NOT EXISTS haotian_website DEFAULT CHARSET utf8mb4;"
sudo mysql -e "CREATE USER 'htweb'@'localhost' IDENTIFIED BY 'your-password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON haotian_website.* TO 'htweb'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 3.2 后端部署

```bash
cd backend

# 安装依赖
npm install

# 配置环境
cp .env.example .env
# 编辑 .env 填入生产环境数据库连接和 JWT_SECRET

# 初始化数据库
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 构建
npm run build

# 使用 PM2 守护进程
npm install -g pm2
pm2 start dist/index.js --name htweb-backend
pm2 save
pm2 startup
```

### 3.3 前端部署

```bash
cd frontend

# 安装依赖
npm install --legacy-peer-deps

# 构建（输出 standalone）
npm run build

# 测试运行
node .next/standalone/server.js

# 使用 PM2
pm2 start .next/standalone/server.js --name htweb-frontend
pm2 save
```

### 3.4 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install nginx

# 复制配置
sudo cp nginx/default.conf /etc/nginx/sites-available/htweb
sudo ln -s /etc/nginx/sites-available/htweb /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 检查配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 4. 域名和 HTTPS

### 4.1 配置域名

修改 `/etc/nginx/sites-available/htweb` 中的 `server_name`:

```nginx
server_name your-domain.com www.your-domain.com;
```

### 4.2 配置 SSL（Certbot）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 自动获取证书并配置
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 证书自动续期（默认已配置定时任务）
sudo certbot renew --dry-run
```

### 4.3 完整 HTTPS Nginx 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_cache_valid 200 30d;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 5. 数据库备份

### 5.1 手动备份

```bash
# Docker 部署
docker exec haotian-mysql mysqldump -u root -p haotian_website > backup_$(date +%Y%m%d).sql

# 手动部署
mysqldump -u htweb -p haotian_website > backup_$(date +%Y%m%d).sql
```

### 5.2 定时自动备份

```bash
sudo crontab -e

# 每天凌晨 3 点备份，保留最近 7 天
0 3 * * * docker exec haotian-mysql mysqldump -u root -proot haotian_website > /backup/db_$(date +\%Y\%m\%d).sql && find /backup -name "db_*.sql" -mtime +7 -delete
```

### 5.3 备份恢复

```bash
# Docker 部署
cat backup_20240601.sql | docker exec -i haotian-mysql mysql -u root -p haotian_website

# 手动部署
mysql -u htweb -p haotian_website < backup_20240601.sql
```

---

## 6. 日志和监控

### 6.1 Docker 日志

```bash
# 查看所有服务日志
docker-compose logs --tail=100 -f

# 查看特定服务
docker-compose logs --tail=100 -f backend
docker-compose logs --tail=100 -f frontend
```

### 6.2 查看应用日志

后端错误日志输出到 stderr，可通过 `pm2 logs` 查看（手动部署时）。

### 6.3 健康检查

```bash
# API 健康检查
curl https://your-domain.com/api/health

# 前端可用性
curl -I https://your-domain.com/
```

---

## 7. 常见问题

### 7.1 数据库连接失败

```bash
# Docker 部署：检查 MySQL 容器状态
docker ps | grep haotian-mysql
docker logs haotian-mysql --tail=50

# 检查后端配置中的 DATABASE_URL 是否正确
docker exec haotian-backend env | grep DATABASE_URL
```

### 7.2 图片上传 403 或 404

```bash
# 检查上传目录权限
docker exec haotian-backend ls -la /app/uploads

# 检查 Nginx client_max_body_size（需 ≥ 5MB）
grep client_max_body_size /etc/nginx/conf.d/default.conf
```

### 7.3 前端白屏或路由 404

```bash
# Docker 部署：检查前端日志
docker logs haotian-frontend --tail=50

# 确认 NEXT_PUBLIC_API_URL 环境变量正确
docker exec haotian-frontend env | grep NEXT_PUBLIC_API_URL
```

### 7.4 部署后修改未生效

```bash
# 确认使用了 --build 参数重新构建
docker-compose up -d --build

# 确认没有浏览器缓存（硬刷新或使用无痕模式）
```

### 7.5 端口冲突

```bash
# 检查 80 端口占用
sudo lsof -i :80

# 修改 docker-compose.yml 中 ports 映射为其他端口
```
