# 💎 Diamond 钻石租借女友事务所 - 完整项目

基于动漫《租借女友（彼女、お借りします）》还原的「Diamond 钻石租借女友事务所」官方网站，完整的前后端商业级项目。

---

## 🚀 快速启动

### 前置要求
- Node.js 18+
- 已有 npm

### 第一步：启动后端

```bash
cd diamond-rental/server
npm install  # 首次运行安装依赖
node index.js
```

后端将在 http://localhost:3001 运行，数据库自动初始化并填充初始数据。

### 第二步：启动前端

```bash
cd diamond-rental/client
npm install  # 首次运行安装依赖
npm run dev
```

前端将在 http://localhost:5173（或 5174）运行。

---

## 🌐 访问地址

| 端口 | 说明 |
|------|------|
| http://localhost:5173 | 前端网站 |
| http://localhost:3001 | 后端 API |
| http://localhost:3001/api/characters | 角色列表 API |

---

## 👤 默认账号

| 账号 | 密码 | 权限 |
|------|------|------|
| admin | admin123 | 管理员 |

> 也可以在 /user 页面注册新普通用户账号。

---

## 📁 项目结构

```
diamond-rental/
├── server/                    # Node.js + Express 后端
│   ├── index.js               # 主入口
│   ├── package.json
│   ├── db/
│   │   ├── database.js        # SQLite 数据库 + Schema
│   │   └── seed.js            # 种子数据（4位角色、服务）
│   ├── middleware/
│   │   └── auth.js            # JWT 认证中间件
│   └── routes/
│       ├── auth.js            # 登录/注册
│       ├── characters.js      # 角色 CRUD
│       ├── orders.js          # 订单管理
│       ├── services.js        # 服务项目
│       └── admin.js           # 管理后台
│
└── client/                    # Vue 3 + Vite 前端
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── App.vue
        ├── style.css           # 全局样式 + CSS 变量
        ├── services/
        │   └── api.js          # Axios 封装 + 拦截器
        ├── stores/
        │   └── auth.js         # 认证状态管理
        ├── router/
        │   └── index.js        # Vue Router
        ├── components/
        │   ├── NavBar.vue      # 导航栏
        │   ├── FooterBar.vue   # 页脚
        │   ├── HeroBanner.vue  # 首页 Banner
        │   ├── CharacterCard.vue  # 角色卡片
        │   ├── ServiceCard.vue    # 服务卡片
        │   ├── ReviewCard.vue     # 评价卡片
        │   └── BookingModal.vue   # 预约弹窗
        └── pages/
            ├── HomePage.vue       # 首页
            ├── CharactersPage.vue # 角色列表
            ├── CharacterDetail.vue # 角色详情
            ├── ServicesPage.vue   # 服务介绍
            ├── BookingPage.vue    # 预约下单
            ├── UserCenter.vue     # 用户中心
            └── AdminDashboard.vue # 管理后台
```

---

## 🎨 设计规范

| 设计元素 | 数值 |
|---------|------|
| 主色 | #f8c8dc（浅粉） |
| 辅色 | #a8d8ea（淡蓝） |
| 强调色 | #f5a6b8（深粉） |
| 背景色 | #fff5f7（暖白粉） |
| 文字色 | #4a3540（柔深色） |
| 字体 | Noto Sans JP |
| 圆角 | 16px（卡片），8px（小组件） |
| 风格 | 日系清新少女感，温柔治愈 |

---

## 📋 页面列表

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | 首页 | Banner + 精选角色 + 服务 + 评价 + 预约入口 |
| `/characters` | 角色图鉴 | 4位角色卡片，过滤/排序 |
| `/characters/:id` | 角色详情 | 详细介绍 + 可预约时段 + 评价 |
| `/services` | 服务介绍 | 6类服务 + 须知 + 流程 + 收费 |
| `/booking/:id` | 预约下单 | 选时间 + 填信息 + 提交订单 |
| `/user` | 用户中心 | 登录/注册 + 我的订单 + 个人资料 |
| `/admin` | 管理后台 | 仪表盘 + 订单/角色/用户管理 |

---

## 🔌 API 接口

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录（返回 JWT）
- `GET /api/auth/profile` - 获取当前用户信息

### 角色
- `GET /api/characters` - 获取所有角色
- `GET /api/characters/:id` - 获取角色详情
- `POST /api/characters` - 新增角色（管理员）
- `PUT /api/characters/:id` - 更新角色（管理员）
- `DELETE /api/characters/:id` - 删除角色（管理员）

### 订单
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 我的订单列表
- `GET /api/orders/:id` - 订单详情
- `PUT /api/orders/:id/status` - 更新订单状态

### 服务 & 管理
- `GET /api/services` - 获取服务列表
- `GET /api/admin/dashboard` - 管理仪表盘数据
- `GET /api/admin/orders` - 所有订单（管理员）
- `GET /api/admin/users` - 所有用户（管理员）

---

## 🗄️ 数据库

使用 SQLite（better-sqlite3），数据库文件自动生成于 `server/diamond.db`。

**数据表：**
- `users` - 用户表（id, username, password, email, phone, role）
- `characters` - 角色表（含价格、标签、时段等）
- `services` - 服务表
- `orders` - 订单表（含状态机：pending→confirmed→ongoing→completed/cancelled）
- `reviews` - 评价表

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| 后端框架 | Node.js + Express |
| 数据库 | SQLite（better-sqlite3） |
| 认证 | JWT（jsonwebtoken） |
| 密码 | bcryptjs |
| 样式 | 纯 CSS3（无框架依赖） |

---

## 📝 后续素材替换指南

项目中角色图片使用了渐变色占位图。替换真实图片步骤：

1. 将角色立绘图片放入 `client/public/images/characters/`
2. 文件命名规则：
   - `chizuru_avatar.png` - 水原千鹤头像
   - `chizuru_full.png` - 水原千鹤全身
   - `mami_avatar.png` - 七海麻美头像
   - `mami_full.png` - 七海麻美全身
   - `ruka_avatar.png` - 更科瑠夏头像
   - `ruka_full.png` - 更科瑠夏全身
   - `sumi_avatar.png` - 樱泽墨头像
   - `sumi_full.png` - 樱泽墨全身
3. 在 `CharacterCard.vue` 中添加 `<img>` 标签引用路径即可

---

*💎 Diamond 钻石租借事务所 — 温暖的陪伴，从这里开始*
