# 数据库切换指南

## 当前状态

✅ **当前使用：本地开发数据库**

- URL: `http://127.0.0.1:54321`
- 数据库: 本地 PostgreSQL (通过 Supabase CLI)
- 状态: 已初始化，包含 `articles` 和 `annotations` 表

## 如何确认当前使用的数据库

### 方法 1: 检查环境变量

查看 `.env.local` 文件中的 `NEXT_PUBLIC_SUPABASE_URL`：

- **本地数据库**: `http://127.0.0.1:54321` 或 `http://localhost:54321`
- **远程数据库**: `https://xxx.supabase.co` (你的项目 URL)

### 方法 2: 检查浏览器网络请求

1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 上传一篇文章
4. 查看请求的 URL：
   - 本地: `http://127.0.0.1:54321/rest/v1/articles`
   - 远程: `https://xxx.supabase.co/rest/v1/articles`

### 方法 3: 检查本地 Supabase 状态

```bash
supabase status
```

如果看到本地服务运行信息，说明配置为本地数据库。

---

## 切换到本地数据库（开发环境）

### 前提条件

1. 已安装 Supabase CLI
2. 本地 Supabase 服务正在运行

### 步骤

1. **确保本地 Supabase 正在运行**
   ```bash
   supabase start
   ```

2. **初始化本地数据库（如果还没有）**
   ```bash
   supabase db reset
   ```
   这会执行 `supabase/schema.sql` 和 `supabase/seed.sql`

3. **配置环境变量**
   
   编辑 `.env.local` 文件，确保使用本地配置：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
   ```

4. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

5. **验证切换成功**
   - 访问 http://localhost:3000
   - 尝试上传一篇文章
   - 检查浏览器 Network 标签，确认请求发送到 `127.0.0.1:54321`

---

## 切换到远程数据库（生产环境）

### 前提条件

1. 已有 Supabase 远程项目
2. 远程数据库已执行 `schema.sql`
3. 已获取 API Keys（在 Supabase Dashboard → Settings → API）

### 步骤

1. **获取远程项目配置**
   
   在 Supabase Dashboard (https://supabase.com/dashboard):
   - 进入你的项目
   - Settings → API
   - 复制以下信息：
     - Project URL: `https://xxx.supabase.co`
     - anon public key: `eyJhbGc...`
     - service_role key: `eyJhbGc...` (保密！)

2. **配置环境变量**
   
   编辑 `.env.local` 文件，替换为远程配置：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的远程anon_key
   SUPABASE_SERVICE_ROLE_KEY=你的远程service_role_key
   ```

3. **确保远程数据库已初始化**
   
   在 Supabase Dashboard → SQL Editor 中执行 `supabase/schema.sql`

4. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

5. **验证切换成功**
   - 访问 http://localhost:3000
   - 尝试上传一篇文章
   - 检查浏览器 Network 标签，确认请求发送到远程 URL

---

## 本地 Supabase 管理命令

### 启动本地服务
```bash
supabase start
```

### 停止本地服务
```bash
supabase stop
```

### 重置本地数据库（清空并重新初始化）
```bash
supabase db reset
```

### 查看本地服务状态
```bash
supabase status
```

### 打开本地 Supabase Studio（数据库管理界面）
```bash
# 访问 http://127.0.0.1:54323
# 或运行：
supabase studio
```

---

## 常见问题

### Q: 如何知道当前使用的是哪个数据库？

A: 检查 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL`，或查看浏览器 Network 请求的 URL。

### Q: 切换数据库后需要重启服务器吗？

A: 是的，修改 `.env.local` 后必须重启 Next.js 开发服务器才能生效。

### Q: 本地数据库的数据会丢失吗？

A: 运行 `supabase db reset` 会清空并重新初始化数据库。如果需要保留数据，不要运行 reset 命令。

### Q: 可以同时使用本地和远程数据库吗？

A: 不可以，应用同时只能连接一个数据库。但你可以通过修改 `.env.local` 快速切换。

### Q: 本地数据库的默认用户和密码是什么？

A: 本地 Supabase 使用默认配置：
- 数据库用户: `postgres`
- 数据库密码: `postgres`
- 数据库名: `postgres`
- 端口: `54322`

---

## 推荐工作流程

### 开发阶段
- ✅ 使用本地数据库（快速、免费、无网络限制）
- ✅ 使用 `supabase db reset` 快速重置测试数据

### 测试/生产阶段
- ✅ 使用远程数据库（真实环境、数据持久化）
- ✅ 在 Supabase Dashboard 中管理数据

---

**提示**: `.env.local` 文件已包含详细的切换说明注释，可以直接参考。

