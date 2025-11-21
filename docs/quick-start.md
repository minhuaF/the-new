# 快速启动指南

## 前置准备

### 1. 环境要求
- Node.js 20+
- npm 或 yarn
- Git

### 2. 获取 Supabase 配置

#### 创建项目
1. 访问 [https://supabase.com](https://supabase.com)
2. 登录并创建新项目
3. 记住数据库密码

#### 获取 API Keys
1. 进入项目设置: **Settings** → **API**
2. 复制以下信息:
   - Project URL
   - anon / public key
   - service_role key (保密!)

### 3. 获取 GLM API Key

1. 访问 [https://bigmodel.cn](https://bigmodel.cn)
2. 注册/登录账号
3. 进入控制台创建 API Key
4. 复制 API Key

---

## 5分钟快速部署

### Step 1: 克隆并安装

```bash
# 进入项目目录
cd the-new

# 安装依赖
npm install
```

### Step 2: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件
# 粘贴你的 Supabase 和 GLM 配置
```

`.env.local` 内容示例:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
GLM_API_KEY=xxx.xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: 初始化数据库

1. 打开 Supabase 项目控制台
2. 左侧菜单 → **SQL Editor**
3. 点击 **New query**
4. 复制 `supabase/schema.sql` 的全部内容
5. 粘贴并点击 **Run**

等待执行完成，确认所有表创建成功。

### Step 4: 创建 Storage Bucket

1. 左侧菜单 → **Storage**
2. 点击 **Create a new bucket**
3. 配置:
   - Name: `pronunciations`
   - ✅ Public bucket
   - File size limit: 10 MB
   - Allowed MIME types: `audio/mpeg, audio/mp3`
4. 点击 **Create bucket**

### Step 5: 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 验证安装

### 1. 测试首页
- 打开浏览器访问 http://localhost:3000
- 应该看到精美的首页
- 有 "开始使用" 和 "登录" 按钮

### 2. 测试注册
1. 点击 "开始使用"
2. 填写邮箱和密码
3. 提交注册
4. 查收验证邮件（可能在垃圾箱）
5. 点击邮件中的验证链接

### 3. 测试登录
1. 使用注册的账号登录
2. 应该跳转到文章列表页 (`/articles`)
3. 看到空状态提示

### 4. 测试上传文章
1. 点击 "上传新文章"
2. 填写标题: `How to Order Coffee`
3. 粘贴任意英文文章内容
4. 点击 "保存文章"
5. 应该跳转到文章详情页（目前为空，Week 4 实现）

### 5. 返回文章列表
- 点击浏览器返回按钮
- 或访问 `/articles`
- 应该看到刚才上传的文章卡片

---

## 常见问题

### Q1: 启动报错 "Invalid Supabase URL"
**A**: 检查 `.env.local` 文件是否正确配置了 `NEXT_PUBLIC_SUPABASE_URL`

### Q2: 登录后无法获取数据
**A**:
1. 检查数据库表是否正确创建
2. 检查 RLS 策略是否启用
3. 查看浏览器控制台错误信息

### Q3: 注册后没收到验证邮件
**A**:
1. 检查垃圾邮件箱
2. Supabase 免费版邮件可能延迟
3. 可以在 Supabase 控制台手动确认用户

### Q4: npm install 失败
**A**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### Q5: 端口 3000 被占用
**A**:
```bash
# 使用其他端口
npm run dev -- -p 3001

# 或者杀掉占用进程
lsof -ti:3000 | xargs kill
```

---

## 下一步

### 当前功能 (Week 1-2) ✅
- ✅ 用户注册/登录
- ✅ 文章上传
- ✅ 文章列表

### 即将开发 (Week 3+)
- [ ] 文本选择与标注
- [ ] GLM AI 查询发音
- [ ] 动态高亮渲染
- [ ] 音频播放
- [ ] 标注侧边栏

---

## 开发模式

### 实时刷新
修改代码后，页面会自动刷新（Hot Reload）

### 查看日志
```bash
# 终端会显示:
- 编译状态
- 请求日志
- 错误信息
```

### 停止服务器
按 `Ctrl + C`

---

## 生产部署 (可选)

### Vercel 一键部署

1. 推送代码到 GitHub
2. 访问 [https://vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 配置环境变量 (同 `.env.local`)
5. 点击 Deploy

### 环境变量配置

在 Vercel 项目设置中添加:
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GLM_API_KEY=xxx
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 技术支持

遇到问题？
1. 查看 `/docs/` 目录下的详细文档
2. 检查 [项目进度总结](./progress-summary.md)
3. 查看 [一期开发计划](./phase-1-plan.md)

---

**🎉 恭喜！你已经成功启动了英语学习平台！**

开始上传文章，准备迎接 Week 3 的核心功能吧！
