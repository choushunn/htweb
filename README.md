# 昊天官网 - 企业官方网站

基于 Next.js 14+ (App Router) + Express.js + MySQL 的企业官方网站，支持前台展示和后台管理。

## 技术栈

### 前端
- **框架**: Next.js 14+ (App Router)
- **样式**: Tailwind CSS + Ant Design
- **HTTP**: Axios
- **构建**: Turbopack

### 后端
- **框架**: Express.js + TypeScript
- **数据库**: MySQL 8.0
- **ORM**: Prisma
- **认证**: JWT + bcrypt
- **验证**: Zod
- **文件上传**: Multer

### 部署
- **容器化**: Docker Compose (Nginx + Next.js + Express + MySQL)

## 项目结构

```
project/
├── frontend/           # Next.js 前端
│   ├── app/            # App Router 页面
│   │   ├── page.tsx          # 首页
│   │   ├── products/         # 产品中心
│   │   ├── certificates/     # 企业资质
│   │   ├── news/            # 新闻中心
│   │   ├── contact/         # 联系我们
│   │   └── admin/           # 后台管理
│   ├── components/     # 公共组件
│   │   └── layout/     # 布局组件
│   ├── contexts/       # React Context
│   ├── lib/            # 工具库
│   └── Dockerfile
├── backend/            # Express 后端
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   │   ├── public/ # 公开接口
│   │   │   └── admin/  # 管理接口
│   │   ├── middleware/ # 中间件
│   │   └── lib/        # 工具库
│   ├── prisma/         # Prisma Schema & Seed
│   └── Dockerfile
├── nginx/              # Nginx 配置
│   └── default.conf
├── docker-compose.yml
└── .env
```

## 快速开始

### 本地开发

#### 前置条件
- Node.js 18+
- MySQL 8.0
- pnpm / npm

#### 1. 启动数据库

```bash
# 确保本地 MySQL 运行，创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS haotian_website DEFAULT CHARSET utf8mb4;"
```

#### 2. 启动后端

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed    # 创建默认管理员
npm run dev           # http://localhost:3001
```

#### 3. 启动前端

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev           # http://localhost:3000
```

#### 4. 访问

- 前台首页: http://localhost:3000
- 后台管理: http://localhost:3000/admin
- 默认管理员: `admin` / `admin123`

### Docker 部署

```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 初始化数据库（首次部署）
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed

# 停止服务
docker-compose down
```

访问 http://localhost

## 功能模块

### 前台展示
| 页面 | 功能 |
|------|------|
| 首页 | 轮播 Banner、公司简介、产品入口、新闻动态 |
| 产品中心 | 产品分类筛选、产品列表、产品详情 |
| 企业资质 | 资质证书图片墙、图片放大查看 |
| 新闻中心 | 新闻列表、新闻详情（富文本） |
| 联系我们 | 公司信息展示、在线留言 |

### 后台管理
| 模块 | 功能 |
|------|------|
| 仪表盘 | 数据统计概览 |
| 新闻管理 | 新增/编辑/删除/发布控制 |
| 产品管理 | 新增/编辑/删除/发布控制 |
| 分类管理 | 产品分类维护 |
| 资质管理 | 资质证书管理 |
| 轮播管理 | 首页 Banner 管理 |
| 留言管理 | 查看/标记已读 |

## API 接口

### 公开接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/news | 新闻列表（分页） |
| GET | /api/news/:id | 新闻详情 |
| GET | /api/products | 产品列表（分页+分类筛选） |
| GET | /api/products/:id | 产品详情 |
| GET | /api/certificates | 资质列表 |
| GET | /api/banners | 轮播列表 |
| POST | /api/messages | 提交留言 |

### 管理接口（需 JWT）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 管理员登录 |
| GET/POST/PUT/DELETE | /api/admin/news | 新闻 CRUD |
| GET/POST/PUT/DELETE | /api/admin/products | 产品 CRUD |
| GET/POST/PUT/DELETE | /api/admin/categories | 分类 CRUD |
| GET/POST/PUT/DELETE | /api/admin/certificates | 资质 CRUD |
| GET/POST/PUT/DELETE | /api/admin/banners | 轮播 CRUD |
| GET | /api/admin/messages | 留言列表 |
| PUT | /api/admin/messages/:id/read | 标记已读 |
