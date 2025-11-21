# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录或注册账号
3. 点击 "New Project"
4. 填写项目信息:
   - Name: `english-learning-platform`
   - Database Password: 设置一个强密码
   - Region: 选择离用户最近的区域 (建议: Singapore 或 Tokyo)
5. 点击 "Create new project"

## 2. 执行数据库初始化

1. 在 Supabase 控制台，进入项目
2. 左侧菜单选择 "SQL Editor"
3. 点击 "New query"
4. 复制 `/supabase/schema.sql` 中的所有内容
5. 粘贴到编辑器并点击 "Run"
6. 确认所有表和策略创建成功

## 3. 创建 Storage Bucket (用于音频文件)

1. 左侧菜单选择 "Storage"
2. 点击 "Create a new bucket"
3. 配置如下:
   - Name: `pronunciations`
   - Public bucket: 勾选 ✅ (允许公开访问音频文件)
   - File size limit: 10 MB
   - Allowed MIME types: `audio/mpeg, audio/mp3`
4. 点击 "Create bucket"

## 4. 获取 API Keys

1. 左侧菜单选择 "Settings" → "API"
2. 复制以下信息:
   - Project URL: `https://xxx.supabase.co`
   - anon public key: `eyJhbGc...` (用于客户端)
   - service_role key: `eyJhbGc...` (用于服务端，保密！)

## 5. 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 填入以下内容:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key

# GLM (智谱AI)
GLM_API_KEY=你的GLM_API_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. 验证配置

启动开发服务器:

```bash
npm run dev
```

访问 http://localhost:3000，确认应用正常运行。

## 数据库结构

### articles 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户ID (外键) |
| title | TEXT | 文章标题 |
| content | TEXT | 文章内容 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### annotations 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| article_id | UUID | 文章ID (外键) |
| user_id | UUID | 用户ID (外键) |
| selected_text | TEXT | 选中的单词/短语 |
| start_offset | INT | 起始位置 |
| end_offset | INT | 结束位置 |
| context_sentence | TEXT | 所在句子 |
| phonetic | TEXT | 音标 |
| audio_url | TEXT | 音频URL |
| definition | JSONB | 释义 |
| note_content | TEXT | 笔记内容 (二期) |
| ai_suggestions | TEXT | AI建议 (二期) |
| highlight_color | TEXT | 高亮颜色 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

## 安全策略 (RLS)

所有表都启用了行级安全策略 (Row Level Security)，确保:
- 用户只能访问自己的数据
- 未认证用户无法访问任何数据
- 防止数据泄露和越权访问

## 下一步

配置完成后，可以开始实现用户认证系统。
