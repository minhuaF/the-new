# 开发环境设置指南

本文档介绍如何正确启动和管理项目的开发环境。

## 问题背景

在重启电脑后，可能会遇到以下问题：
- 数据库连接失败
- Supabase 服务不可用
- 认证请求失败（401/500 错误）

**根本原因**：本地 Supabase 服务依赖 Docker，重启电脑后 Docker 和 Supabase 服务没有自动启动。

## 解决方案

我们提供了自动化脚本来解决这个问题。

### 方式一：使用集成启动脚本（推荐）

使用 `npm run dev:full` 命令，会自动完成以下步骤：
1. 检查并启动 Docker（如果需要）
2. 检查并启动 Supabase 本地服务（如果需要）
3. 启动 Next.js 开发服务器

```bash
npm run dev:full
```

### 方式二：手动启动（传统方式）

如果你更喜欢分步骤启动，可以使用以下命令：

```bash
# 1. 确保 Docker Desktop 正在运行
# 可以从 Applications 手动打开，或者等待 dev:full 自动启动

# 2. 启动 Supabase
npm run supabase:start

# 3. 启动 Next.js
npm run dev
```

## 可用的 npm 脚本

### 开发环境

| 命令 | 说明 |
|------|------|
| `npm run dev:full` | 启动完整开发环境（Docker + Supabase + Next.js）**推荐** |
| `npm run dev` | 只启动 Next.js 开发服务器（需要手动启动 Supabase） |
| `npm run stop` | 停止 Supabase 服务 |

### Supabase 管理

| 命令 | 说明 |
|------|------|
| `npm run supabase:start` | 启动 Supabase 本地服务 |
| `npm run supabase:stop` | 停止 Supabase 本地服务 |
| `npm run supabase:status` | 查看 Supabase 服务状态 |
| `npm run supabase:reset` | 重置本地数据库（重新应用 migrations） |

### 构建和部署

| 命令 | 说明 |
|------|------|
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |

## 常见问题

### Q: Docker 启动失败怎么办？

**A**:
1. 确保已安装 Docker Desktop：https://www.docker.com/products/docker-desktop
2. 手动打开 Docker Desktop，等待启动完成
3. 重新运行 `npm run dev:full`

### Q: Supabase 启动失败怎么办？

**A**:
1. 检查 Docker 是否正在运行：`docker info`
2. 查看 Supabase 状态：`npm run supabase:status`
3. 尝试重启 Supabase：
   ```bash
   npm run supabase:stop
   npm run supabase:start
   ```
4. 如果仍然失败，尝试重置数据库：`npm run supabase:reset`

### Q: 端口被占用怎么办？

**A**: Supabase 默认使用以下端口：
- `54321` - API Gateway
- `54323` - Supabase Studio（数据库管理界面）
- `54322` - PostgreSQL
- `54324` - Realtime
- `54325` - Storage

如果端口被占用，可以：
1. 查找占用端口的进程：`lsof -i :54321`
2. 停止该进程
3. 或修改 `supabase/config.toml` 中的端口配置

### Q: 重启电脑后需要做什么？

**A**: 只需运行 `npm run dev:full`，脚本会自动检查并启动所有必需的服务。

## 开发环境访问地址

启动成功后，可以访问：

- **应用**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323
  - 用户名/密码：在 Studio 界面会显示（本地开发无需密码）
- **API Gateway**: http://127.0.0.1:54321

## 最佳实践

1. **每天开始工作前**：运行 `npm run dev:full` 确保环境正常
2. **结束工作后**：可以运行 `npm run stop` 停止 Supabase 节省资源（可选）
3. **遇到奇怪问题时**：尝试 `npm run supabase:reset` 重置数据库
4. **切换分支后**：如果数据库 schema 有变化，运行 `npm run supabase:reset`

## 故障排查流程

如果遇到问题，按以下顺序检查：

```bash
# 1. 检查 Docker 状态
docker info

# 2. 检查 Supabase 状态
npm run supabase:status

# 3. 如果 Supabase 未运行，启动它
npm run supabase:start

# 4. 检查环境变量配置
cat .env.local

# 5. 如果仍有问题，重置数据库
npm run supabase:reset

# 6. 最后，启动开发服务器
npm run dev
```

## 技术细节

### 脚本工作原理

`scripts/dev.sh` 脚本执行以下操作：

1. **Docker 检查**
   - 检测 Docker 是否运行
   - 如果未运行，尝试打开 Docker Desktop
   - 等待 Docker 完全启动（最多 60 秒）

2. **Supabase 检查**
   - 检测 Supabase 是否运行
   - 如果未运行，执行 `supabase start`
   - 显示服务状态信息

3. **Next.js 启动**
   - 根据 `package.json` 的 `packageManager` 字段选择 pnpm 或 npm
   - 启动开发服务器

### 环境要求

- Docker Desktop（已安装并可执行）
- Supabase CLI（通过 Homebrew 安装：`brew install supabase/tap/supabase`）
- Node.js 20+
- pnpm 或 npm

## 相关文档

- [Supabase 本地开发文档](https://supabase.com/docs/guides/cli/local-development)
- [Next.js 开发文档](https://nextjs.org/docs)
- [项目 README](../README.md)
