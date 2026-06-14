# 生产环境部署指南

## 目录
- [1. 前端静态部署（推荐）](#1-前端静态部署)
- [2. 后端生产部署](#2-后端生产部署)
- [3. Nginx 反向代理配置](#3-nginx-反向代理配置)
- [4. Docker 部署（进阶）](#4-docker-部署进阶)
- [5. 常见部署平台](#5-常见部署平台)

---

## 1. 前端静态部署

### 1.1 构建生产版本

```bash
cd diamond-rental/client
npm install
npm run build
```

构建产物在 `dist/` 目录，包含所有 JS/CSS/图片资源。

### 1.2 Vite 代理配置修改

生产环境前后端可以部署在同一域名下。修改 `client/vite.config.js`：

```js
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

**生产环境不需要 proxy**（因为 Nginx 会做路由分发）。

### 1.3 部署到静态托管平台

**CloudStudio 部署：**
```bash
# 在 CloudStudio 工作区
cd dist
# 部署静态站点
```

**Vercel / Netlify 部署：**
```bash
npm install -g vercel
vercel --prod
```

**GitHub Pages：**
```bash
npm install -g gh-pages
# 在 package.json 中添加:
# "homepage": "https://yourname.github.io/diamond-rental",
# "scripts": { "deploy": "gh-pages -d dist" }
npm run deploy
```

---

## 2. 后端生产部署

### 2.1 环境变量

创建 `.env` 文件（在 `server/` 目录下）：

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secure-random-string-here-change-me
# SQLite 数据文件路径
DB_PATH=./database.sqlite
```

**⚠️ 安全提醒**：JWT_SECRET 必须换成随机字符串，不要用默认的 `diamond-rental-secret-key-2024`。

### 2.2 PM2 进程管理部署

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd diamond-rental/server
npm install --production
pm2 start index.js --name diamond-server

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs diamond-server

# 重启
pm2 restart diamond-server

# 停止
pm2 stop diamond-server
```

### 2.3 生产环境 server/index.js 修改

需要把图片静态文件目录指向实际路径：

```js
// server/index.js 中
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 生产环境也可以让 Nginx 直接处理图片请求，这行可以注释掉
```

### 2.4 数据库

SQLite 数据文件 `database.sqlite` 需要持久化。

**Docker 部署时挂载 Volume：**
```bash
docker run -v /host/path/data:/app/data diamond-server
```

**云服务器部署时确保数据库文件不被删除。**

---

## 3. Nginx 反向代理配置

### 3.1 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 前端静态文件（Vue Router 使用 history 模式）
    location / {
        root /var/www/diamond-rental/client/dist;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 图片静态资源（不经过 Nginx 缓存，确保实时更新）
    location /images/ {
        root /var/www/diamond-rental/server/public;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
```

### 3.2 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx
```

### 3.3 配置 HTTPS（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 3 * * * certbot renew --quiet
```

---

## 4. Docker 部署（进阶）

### 4.1 前端 Dockerfile

```dockerfile
# client/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 后端 Dockerfile

```dockerfile
# server/Dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

# 复制数据库文件
COPY server/db/database.sqlite /app/data/database.sqlite
COPY server/db/seed.js /app/db/seed.js
COPY server/db/database.js /app/db/database.js
COPY server/routes/ /app/routes/
COPY server/middleware/ /app/middleware/
COPY server/index.js /app/

# 确保数据库目录存在
RUN mkdir -p /app/data

ENV DB_PATH=/app/data/database.sqlite
ENV NODE_ENV=production

EXPOSE 3001
CMD ["node", "/app/index.js"]
```

### 4.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - diamond-network

  backend:
    build: ./diamond-rental
    ports:
      - "3001:3001"
    volumes:
      - db-data:/app/data
    environment:
      - NODE_ENV=production
      - DB_PATH=/app/data/database.sqlite
    networks:
      - diamond-network

networks:
  diamond-network:
    driver: bridge

volumes:
  db-data:
```

---

## 5. 常见部署平台

### 5.1 前端推荐

| 平台 | 免费额度 | 说明 |
|------|---------|------|
| **CloudStudio** | 免费 | 一键部署，自带 CDN |
| **Vercel** | 免费 100GB/月 | 支持 Git 自动部署 |
| **Netlify** | 免费 100GB/月 | 支持表单/函数 |
| **GitHub Pages** | 免费 | 适合静态站点 |
| **腾讯云 COS + CDN** | 免费 50GB | 国内访问快 |
| **阿里云 OSS + CDN** | 免费 50GB | 国内访问快 |

### 5.2 后端推荐

| 平台 | 免费额度 | 说明 |
|------|---------|------|
| **Railway** | 免费 $5/月 | 支持 Node.js |
| **Render** | 免费 750小时/月 | 自动 HTTPS |
| **阿里云 ECS** | ¥9.9/月起 | 国内必备 ICP 备案 |
| **腾讯云 CVM** | ¥9.9/月起 | 国内必备 ICP 备案 |
| **AWS EC2** | 12个月免费 | 全球可用 |
| **Docker + 任意 VPS** | ¥9.9/月起 | 最灵活 |

### 5.3 国内 ICP 备案须知

如果部署在国内服务器（阿里云、腾讯云等），**必须完成 ICP 备案**：

1. 在云控制台提交备案申请
2. 准备身份证 + 域名 + 企业信息（个人也可备案）
3. 审核周期约 7-20 个工作日
4. 备案通过后域名才能解析到国内 IP

如果没有备案域名，建议使用海外 VPS 或 CloudStudio/Vercel 等免备案平台。

---

## 6. 部署检查清单

- [ ] 前端 `npm run build` 构建成功，`dist/` 目录正常
- [ ] 后端 `node index.js` 能正常启动
- [ ] `.env` 文件已配置，JWT_SECRET 已更换为随机字符串
- [ ] 数据库文件 `database.sqlite` 已持久化
- [ ] 所有 API 接口测试通过（Postman/curl）
- [ ] 用户注册/登录/预约流程完整测试
- [ ] 图片资源能正常加载
- [ ] 域名已配置 DNS 解析
- [ ] Nginx 配置语法检查通过（`nginx -t`）
- [ ] HTTPS 证书已配置
- [ ] 数据库定期备份方案已制定
- [ ] 日志监控已配置（PM2 logs / 云平台日志）
- [ ] 防火墙规则已设置（只开放 80/443 端口）

---

## 7. 常见问题

### Q: 前端构建后接口 404
A: 检查 `api.js` 中的 `baseURL: '/api'`，确保请求路径正确。

### Q: 图片 404
A: 确认 `express.static('/images')` 路径指向正确，或让 Nginx 处理静态资源。

### Q: 数据库文件丢失
A: 部署时确保 `database.sqlite` 文件被复制，或使用 Docker Volume 持久化。

### Q: 登录后页面白屏
A: 检查 localStorage 是否被浏览器限制，确保 token 正确写入。

### Q: 数据库连接失败（Docker）
A: 确保 `better-sqlite3` 的 native addon 已编译，`npm install --build-from-source`。

---

*💎 Diamond 钻石租借事务所 — 部署完成，温暖上线*
