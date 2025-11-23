# 英语学习平台

智能英文阅读标注工具 - 让英文阅读更简单

## 功能特点

- 📚 **智能标注**: 选中单词即可添加发音标注
- 🔊 **发音学习**: AI 生成音标、释义和真人发音
- ✨ **动态渲染**: 高亮显示标注单词，悬浮显示音标
- 📝 **侧边管理**: 统一管理所有标注，随时复习

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **AI模型**: GLM-4 (智谱AI)
- **状态管理**: Zustand

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```bash
cp .env.example .env.local
```

需要配置：
- Supabase 项目信息（[注册地址](https://supabase.com)）
- GLM API Key（[获取地址](https://bigmodel.cn)）

详细配置步骤见 [docs/supabase-setup.md](./docs/supabase-setup.md)

### 3. 初始化数据库

1. 登录 Supabase 控制台
2. 进入 SQL Editor
3. 执行 `supabase/schema.sql` 中的 SQL 语句

### 4. 启动开发服务器

#### 方式一：自动启动（推荐）

使用集成启动脚本，自动检查并启动 Docker、Supabase 和 Next.js：

```bash
npm run dev:full
```

#### 方式二：手动启动

```bash
# 1. 确保 Docker Desktop 正在运行
# 2. 启动 Supabase 本地服务
npm run supabase:start

# 3. 启动 Next.js 开发服务器
npm run dev
```

访问：
- **应用**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323

> **💡 提示**: 重启电脑后使用 `npm run dev:full` 可以自动启动所有必需的服务，避免数据库连接错误。详见 [开发环境设置指南](./docs/development-setup.md)

## 开发计划

### 一期 MVP（6周） - 进行中

- [x] 基础设施搭建
- [x] 用户认证系统
- [x] 文章上传和列表
- [ ] GLM API 集成
- [ ] 文本选择与标注
- [ ] 动态高亮渲染
- [ ] 标注侧边栏

详见 [docs/phase-1-plan.md](./docs/phase-1-plan.md) 和 [docs/phase-2-plan.md](./docs/phase-2-plan.md)

---

**让英文阅读更简单** | 智能标注 · 发音学习 · 高效记忆
