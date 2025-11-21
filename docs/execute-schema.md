# 执行数据库 Schema - 快速指南

## 问题
错误：`Could not find the table 'public.articles' in the schema cache`

## 解决方案

### 方法 1：通过 Supabase Dashboard（推荐）

1. **打开 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard/project/rzxiuzkfmufrpzkidfzj
   - 或访问：https://supabase.com/dashboard → 选择你的项目

2. **进入 SQL Editor**
   - 左侧菜单 → **SQL Editor**
   - 点击 **New query**

3. **执行 Schema**
   - 复制 `supabase/schema.sql` 文件的全部内容
   - 粘贴到 SQL Editor
   - 点击 **Run** 或按 `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

4. **验证执行结果**
   - 应该看到 "Success. No rows returned" 或类似的成功消息
   - 检查左侧 **Table Editor**，应该能看到 `articles` 和 `annotations` 两个表

### 方法 2：使用 Supabase CLI（需要登录）

```bash
# 1. 登录 Supabase CLI
supabase login

# 2. 链接到远程项目
supabase link --project-ref rzxiuzkfmufrpzkidfzj

# 3. 执行 schema
supabase db push
```

## 验证

执行完成后，尝试再次上传文章，应该可以成功了。

## 如果遇到错误

- **"relation already exists"**: 表已存在，可以忽略或先删除表
- **"permission denied"**: 检查是否有足够的数据库权限
- **"extension not found"**: UUID 扩展应该自动创建，如果失败可以手动执行第一行

