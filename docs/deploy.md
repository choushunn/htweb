# 部署指南

> 适用于昊天金属科技企业官网的 Docker Compose 生产部署

## 目录

1. [环境要求](#1-环境要求)
2. [部署步骤](#2-部署步骤)
3. [域名和 HTTPS](#3-域名和-https)
4. [数据库备份](#4-数据库备份)
5. [日志和监控](#5-日志和监控)
6. [常见问题](#6-常见问题)

---

## 1. 环境要求

### 生产环境最低配置

| 配置项 | 要求 |
|--------|------|
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 20 GB（SSD 优先） |
| 操作系统 | Ubuntu 20.04+ / Debian 11+ / CentOS 7+ |
| Docker Engine | 24+ |
| Docker Compose | v2+ |

### 网络端口

| 端口 | 用途 | 是否对外开放 |
|------|------|-------------|
| 80 | HTTP（Nginx 反向代理） | 是 |
| 443 | HTTPS（如需 SSL） | 是 |
| 3306 | MySQL | 仅内网 |

---

## 2. 部署步骤

### 2.1 克隆代码

```bash
git clone https://github.com/choushunn/htweb.git
cd htweb
```

### 2.2 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 修改 JWT_SECRET 为随机字符串
# 其他默认配置可直接使用
```

**docker-compose.yml** 已内置默认配置，通常只需修改 `JWT_SECRET`。

### 2.3 一键启动

```bash
# 构建并启动所有服务（Nginx + Next.js + Express + MySQL）
docker compose up -d --build

# 查看启动日志，确认所有服务就绪
docker compose logs -f
```

### 2.4 初始化数据库（仅首次部署）

```bash
# 等待 MySQL 完全就绪后（需 10-30 秒），执行数据库迁移和种子数据
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npx prisma db seed

# 默认管理员: admin / admin123
```

### 2.5 验证部署

```bash
# API 健康检查
curl http://localhost/api/health
# 预期: {"status":"ok","timestamp":"2026-06-20T..."}

# 前端可用性
curl -I http://localhost
# 预期: HTTP/1.1 200 OK
```

### 2.6 更新部署

```bash
git pull
docker compose up -d --build
```

---

## 3. 域名和 HTTPS

### 3.1 配置域名

编辑项目根目录下的 `nginx/default.conf`，将 `server_name _;` 改为您的域名：

```nginx
server_name your-domain.com www.your-domain.com;
```

### 3.2 生成 SSL 证书

```bash
# 先确保域名已解析到服务器 IP

# 临时安装 Certbot（在宿主机上）
sudo apt install certbot

# 获取证书（会临时用 80 端口验证域名所有权）
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 证书路径（供 Nginx 使用）:
#   /etc/letsencrypt/live/your-domain.com/fullchain.pem
#   /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 3.3 启用 HTTPS

将 `nginx/default.conf` 替换为以下 HTTPS 配置：

```nginx
# 重定向 HTTP → HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 服务
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

    client_max_body_size 10M;

    # Frontend (Next.js SSR)
    location / {
        proxy_pass http://frontend:3000;
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
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files (长期缓存)
    location /uploads/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_cache_valid 200 30d;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

更新配置后重启：

```bash
docker compose up -d --build nginx
```

### 3.4 证书自动续期

```bash
# 添加定时任务，每月 1 日凌晨检查续期（证书有效期 90 天）
sudo crontab -e

# 添加以下行：
0 3 1 * * docker compose -f /path/to/htweb/docker-compose.yml restart nginx && certbot renew && docker compose -f /path/to/htweb/docker-compose.yml restart nginx
```

---

## 4. 数据库备份

### 4.1 手动备份

```bash
docker compose exec -T mysql mysqldump -u root -proot haotian_website > backup_$(date +%Y%m%d).sql
```

### 4.2 定时自动备份

```bash
sudo crontab -e

# 每天凌晨 3 点备份，保留最近 7 天
0 3 * * * cd /path/to/htweb && docker compose exec -T mysql mysqldump -u root -proot haotian_website > /backup/db_$(date +\%Y\%m\%d).sql && find /backup -name "db_*.sql" -mtime +7 -delete
```

### 4.3 备份恢复

```bash
cat backup_20240601.sql | docker compose exec -T mysql mysql -u root -proot haotian_website
```

---

## 5. 日志和监控

### 5.1 查看容器日志

```bash
# 所有服务实时日志
docker compose logs --tail=100 -f

# 查看特定服务
docker compose logs --tail=100 -f backend
docker compose logs --tail=100 -f frontend
docker compose logs --tail=100 -f nginx
docker compose logs --tail=100 -f mysql
```

### 5.2 健康检查

```bash
# API 健康
curl https://your-domain.com/api/health

# 前端可用性
curl -I https://your-domain.com/

# 容器状态
docker compose ps
```

---

## 6. 常见问题

### 6.1 数据库连接失败

```bash
# 检查 MySQL 容器是否就绪
docker compose ps mysql
docker compose logs mysql --tail=50

# 确认后端 DATABASE_URL 与 docker-compose.yml 一致
docker compose exec backend env | grep DATABASE_URL
```

### 6.2 图片上传失败

```bash
# 检查 Nginx client_max_body_size 是否 ≥ 5MB
docker compose exec nginx cat /etc/nginx/conf.d/default.conf | grep client_max_body_size

# 检查上传目录卷挂载
docker compose exec backend ls -la /app/uploads
```

### 6.3 前端白屏或路由 404

```bash
docker compose logs frontend --tail=50
```

### 6.4 更新代码后未生效

```bash
# 必须带 --build 重新构建镜像
docker compose up -d --build

# 清除浏览器缓存或使用无痕模式
```

### 6.5 80/443 端口冲突

```bash
# 检查占用端口的进程
sudo lsof -i :80

# 修改 docker-compose.yml 中 nginx ports 映射
```

### 6.6 如何重新部署

```bash
# 完整重新部署（保留数据库）
git pull
docker compose up -d --build

# 完全重建（删除数据卷）
docker compose down -v
# 然后重新执行 2.3 部署步骤
```
