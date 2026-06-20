# 昊天官网 - 山东昊天金属科技有限公司企业官方网站

基于 Next.js 16 (App Router) + Express.js 5 + MySQL 8 的企业官方网站，支持前台展示和后台管理。

## 技术栈

### 前端
| 技术 | 用途 |
|------|------|
| **Next.js 16** | React 框架（App Router，SSR/ISR） |
| **React 19** | UI 库 |
| **Ant Design 6** | 组件库（复杂交互、管理后台） |
| **Tailwind CSS 4** | 原子化样式（公共展示页面） |
| **Axios** | 客户端 HTTP 请求 |
| **Tiptap** | 富文本编辑器（后台内容编辑） |

### 后端
| 技术 | 用途 |
|------|------|
| **Express.js 5** | Web 框架 |
| **TypeScript 5** | 类型安全 |
| **MySQL 8.0** | 关系型数据库 |
| **Prisma 6** | ORM，类型安全的数据库访问 |
| **JWT + bcryptjs** | 认证与密码加密 |
| **Zod 3** | 请求数据验证 |
| **Multer** | 文件上传 |
| **sanitize-html** | XSS 防护 |
| **express-rate-limit** | API 限流 |

### 部署
- **Docker Compose**: Nginx + Next.js (standalone) + Express + MySQL

## 核心架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│   Browser   │────▶│  Nginx       │────▶│ Express  │
│  (Client)   │     │  (反向代理)   │     │  (API)   │
└─────────────┘     └──────┬───────┘     └────┬─────┘
                           │                  │
                           ▼                  ▼
                     ┌───────────┐     ┌──────────┐
                     │ Next.js   │     │  MySQL   │
                     │ (SSR/ISR) │     │ (Prisma) │
                     └───────────┘     └──────────┘
```

### 关键设计决策

- **Server/Client 组件分离**: 公开页面（首页/产品/新闻等）使用 Server Component 在服务端渲染完整 HTML，交互部分（轮播/分页/动画）抽入 `*Client.tsx` 组件
- **ISR 增量静态再生成**: 数据驱动页面设置 `revalidate: 60`，首次请求后缓存 60 秒
- **统一 API 响应格式**: 所有接口返回 `{ success, data, pagination? }` / `{ success: false, error }`
- **Tailwind + Ant Design 双轨制**: Tailwind 覆盖自定义品牌样式，Ant Design 提供成熟组件

## 项目结构

```
htgw/
├── frontend/                    # Next.js 前端
│   ├── app/                     # App Router 页面
│   │   ├── page.tsx             # 首页（Server Component）
│   │   ├── HomePageClient.tsx   # 首页交互部分（Client Component）
│   │   ├── layout.tsx           # 根布局
│   │   ├── globals.css          # 全局样式 + 设计令牌
│   │   ├── not-found.tsx        # 404 页面
│   │   ├── sitemap.ts           # 动态站点地图
│   │   ├── about/               # 关于我们（含子页面）
│   │   ├── products/            # 产品中心（列表 + 动态详情）
│   │   ├── news/                # 新闻中心（列表 + 动态详情）
│   │   ├── certificates/        # 企业资质
│   │   ├── contact/             # 联系我们
│   │   └── admin/               # 后台管理（9 个模块）
│   ├── components/              # 共享组件
│   │   ├── layout/              # 布局：Header/Footer/TopBar/FloatingContact
│   │   ├── ui/                  # UI 原子组件：AnimatedBorder
│   │   └── admin/               # 管理后台组件：Sidebar
│   ├── contexts/                # React Context（SettingsContext）
│   ├── hooks/                   # 自定义 Hooks（useScrollReveal）
│   └── lib/                     # 工具库
│       ├── api.ts               # 客户端 Axios 实例
│       └── serverApi.ts         # 服务端 fetch 封装
├── backend/                     # Express 后端
│   ├── src/
│   │   ├── app.ts               # Express 应用配置
│   │   ├── index.ts             # 入口
│   │   ├── routes/
│   │   │   ├── public/          # 7 个公开路由
│   │   │   ├── admin/           # 9 个管理路由
│   │   │   └── auth.ts          # 登录/改密码
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT 认证
│   │   │   └── upload.ts        # 文件上传
│   │   └── lib/
│   │       ├── prisma.ts        # Prisma 单例
│   │       └── response.ts      # 统一响应 helper
│   ├── prisma/
│   │   ├── schema.prisma        # 8 个数据模型
│   │   └── seed.ts              # 种子数据
│   └── uploads/                 # 上传文件目录
├── nginx/
│   └── default.conf             # Nginx 配置
├── docker-compose.yml           # 容器编排
└── .env.example                 # 环境变量模板
```

## 快速开始

### 前置条件
- Node.js 18+
- MySQL 8.0
- pnpm / npm

### 本地开发

#### 1. 数据库

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS haotian_website DEFAULT CHARSET utf8mb4;"
```

#### 2. 后端

```bash
cd backend
npm install
# 配置环境变量
cp .env.example .env   # 编辑 .env 填入数据库连接信息
# 初始化数据库
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed               # 创建默认管理员
npm run dev                       # http://localhost:3001
```

#### 3. 前端

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev                       # http://localhost:3000
```

#### 4. 访问

| 入口 | 地址 |
|------|------|
| 前台首页 | http://localhost:3000 |
| 后台管理 | http://localhost:3000/admin |
| 健康检查 | http://localhost:3001/api/health |

默认管理员: `admin` / `admin123`

### Docker 部署

```bash
# 一键启动
docker-compose up -d

# 初始化数据库（首次）
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

访问 http://localhost

## 功能模块

### 前台展示（9 个页面）
| 页面 | 路由 | 特性 |
|------|------|------|
| 首页 | `/` | Banner 轮播、公司简介、核心优势、产品展示、新闻动态、品牌宣言 |
| 公司简介 | `/about` | 公司介绍、数据统计、企业文化、发展历程 |
| 企业文化 | `/about/culture` | 核心价值观 |
| 售后服务 | `/about/service` | 服务承诺与流程 |
| 产品中心 | `/products` | 分类筛选、卡片展示、分页 |
| 产品详情 | `/products/[id]` | 图片画廊、详细说明 |
| 新闻中心 | `/news` | 新闻列表、分页、骨架屏 |
| 新闻详情 | `/news/[id]` | 富文本内容 |
| 企业资质 | `/certificates` | 图片墙、放大预览 |
| 联系我们 | `/contact` | 公司信息、在线留言表单 |

### 后台管理（9 个模块）
| 模块 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `/admin` | 数据统计概览（新闻/产品/留言/资质数量） |
| 新闻管理 | `/admin/news` | 新增/编辑/删除/发布/富文本编辑 |
| 产品管理 | `/admin/products` | 新增/编辑/删除/发布/多图管理 |
| 分类管理 | `/admin/categories` | 增删改排序 |
| 资质管理 | `/admin/certificates` | 增删改 |
| 轮播管理 | `/admin/banners` | 增删改排序 |
| 留言管理 | `/admin/messages` | 查看/标记已读/删除 |
| 系统设置 | `/admin/settings` | 站点配置（微信二维码等） |
| 文件上传 | `/api/admin/upload` | 图片上传（5MB 限制） |

## API 接口

### 公开接口（无需认证）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/news` | 新闻列表（分页） |
| GET | `/api/news/:id` | 新闻详情 |
| GET | `/api/products` | 产品列表（分页+分类筛选） |
| GET | `/api/products/:id` | 产品详情 |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/certificates` | 资质列表 |
| GET | `/api/banners` | 轮播列表 |
| GET | `/api/settings` | 站点设置 |
| POST | `/api/messages` | 提交留言（限流：5次/小时/IP） |

### 管理接口（需 JWT）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理员登录（限流：10次/15分钟/IP） |
| PUT | `/api/auth/password` | 修改密码 |
| GET/POST | `/api/admin/news` | 新闻列表/创建 |
| PUT/DELETE | `/api/admin/news/:id` | 更新/删除新闻 |
| GET/POST | `/api/admin/products` | 产品列表/创建 |
| PUT/DELETE | `/api/admin/products/:id` | 更新/删除产品 |
| GET/POST | `/api/admin/categories` | 分类列表/创建 |
| PUT/DELETE | `/api/admin/categories/:id` | 更新/删除分类 |
| GET/POST | `/api/admin/certificates` | 资质列表/创建 |
| PUT/DELETE | `/api/admin/certificates/:id` | 更新/删除资质 |
| GET/POST | `/api/admin/banners` | 轮播列表/创建 |
| PUT/DELETE | `/api/admin/banners/:id` | 更新/删除轮播 |
| GET | `/api/admin/messages` | 留言列表 |
| PUT | `/api/admin/messages/:id/read` | 标记已读 |
| DELETE | `/api/admin/messages/:id` | 删除留言 |
| POST | `/api/admin/upload` | 文件上传 |
| GET | `/api/admin/dashboard` | 仪表盘数据 |
| GET/PUT | `/api/admin/settings` | 站点设置 |

### 统一响应格式

**成功**:
```json
{
  "success": true,
  "data": { ... },
  "pagination": { "page": 1, "pageSize": 10, "total": 42 }
}
```

**失败**:
```json
{
  "success": false,
  "error": "错误描述",
  "details": [{ "field": "name", "message": "必填" }]
}
```

## 数据库模型（8 个表）

| 表 | 主要字段 | 说明 |
|----|----------|------|
| `admin` | username, password (bcrypt) | 管理员用户 |
| `banners` | title, imageUrl, linkUrl, sort, isActive | 首页轮播 |
| `categories` | name, sort | 产品分类 |
| `products` | name, description, detail (HTML), images (JSON), categoryId, sort, isPublished | 产品信息 |
| `news` | title, summary, content (HTML), coverImage, isPublished | 新闻公告 |
| `certificates` | title, imageUrl, sort, isPublished | 资质证书 |
| `messages` | name, phone, email, content, isRead | 访客留言 |
| `site_settings` | key (unique), value | 键值对配置 |

## 安全措施

- **认证**: JWT 7 天有效期，`JWT_SECRET` 启动时校验
- **密码**: bcryptjs 10 轮加密
- **XSS**: `sanitize-html` 过滤富文本输出
- **限流**: 留言 5次/小时，登录 10次/15分钟
- **输入验证**: Zod `safeParse()` 校验所有写操作
- **文件上传**: MIME 白名单（jpeg/png/webp/gif）、5MB 限制、UUID 重命名
- **数据库**: Prisma 参数化查询（防 SQL 注入）

## 设计规范

### 品牌色
- 主色: `#0070d5`
- Hover: `#005bb5`
- 高亮: `#e8f4fd`

### 设计令牌（`globals.css` `@theme inline`）
```css
--color-brand: #0070d5;
--color-heading: #1a1a1a;
--color-body: #333333;
--color-muted: #666666;
--color-meta: #999999;
--color-bg-alt: #f7f9fa;
--color-footer-bg: #272727;
```

### SEO
- 所有公开页面为 Server Component，搜索引擎接收完整 HTML
- 每个页面有独立 `generateMetadata()` 或静态 `metadata` 导出
- 动态 `sitemap.ts` 自动生成站点地图
- `robots` meta 允许索引和跟踪

### SVG 图标
- 所有图表图标使用 `lucide-react`（前台）和 `@ant-design/icons`（后台）
- 装饰性图标标记 `aria-hidden="true"`
- 功能按钮均提供 `aria-label`

## 浏览器支持
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## 环境变量

### 后端 (`backend/.env`)
```env
DATABASE_URL="mysql://user:password@localhost:3306/haotian_website"
JWT_SECRET="your-jwt-secret"
CORS_ORIGIN="http://localhost:3000"
```

### 前端 (`frontend/.env.local`)
```env
BACKEND_URL=http://localhost:3001
```
