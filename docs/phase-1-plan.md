# 一期 MVP 开发计划

## 项目概述

**产品名称**: 英语学习标注平台
**开发周期**: 6周
**核心目标**: 实现文章上传、阅读、单词标注、发音查询的完整闭环

---

## 功能范围

### ✅ 一期功能清单

1. **用户认证系统**
   - 邮箱注册/登录 (Supabase Auth)
   - 用户会话管理

2. **文章管理**
   - 上传文章 (纯文本粘贴)
   - 文章列表展示
   - 文章详情页

3. **核心标注功能**
   - 文本选择
   - 浮窗菜单 (添加发音)
   - GLM 模型集成 (查询音标、释义、生成音频)
   - 标注数据存储

4. **动态渲染系统**
   - 原文与标注分离存储
   - 渲染时动态匹配高亮
   - 音标显示 (悬浮或内联)
   - 点击播放发音

5. **侧边栏展示**
   - 标注列表
   - 播放发音
   - 跳转到原文
   - 删除标注

### ❌ 一期不包含

- 笔记功能
- 网页爬取
- 分享图片生成
- 订阅与支付
- 知识图谱
- 复习系统

---

## 技术架构

### 技术栈

**前端框架**
- Next.js 15.2.2 (App Router)
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4

**UI 组件**
- shadcn/ui (Radix UI)
- Lucide Icons

**状态管理**
- Zustand

**后端服务**
- Supabase (PostgreSQL + Auth + Storage)

**AI 模型**
- GLM-4 (智谱AI)
  - 文本生成: glm-4-flash
  - 语音合成: glm-4-voice

### 数据库设计

```sql
-- 文章表
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 标注表（发音 + 笔记合并）
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,

  -- 选中文本信息
  selected_text TEXT NOT NULL,
  start_offset INT NOT NULL,
  end_offset INT NOT NULL,
  context_sentence TEXT,

  -- 发音数据（一期使用）
  phonetic TEXT,
  audio_url TEXT,
  definition JSONB,

  -- 笔记数据（二期使用）
  note_content TEXT,
  ai_suggestions TEXT,

  -- 视觉样式
  highlight_color TEXT DEFAULT '#FFF59D',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_annotations_article ON annotations(article_id);
CREATE INDEX idx_annotations_user ON annotations(user_id);
CREATE INDEX idx_articles_user ON articles(user_id);
```

---

## 开发计划

### Week 1: 基础设施

**任务清单**
- [x] 初始化项目依赖
- [x] 配置 Supabase 项目
- [x] 创建数据库表和索引
- [x] 设置环境变量
- [x] 配置 shadcn/ui
- [x] 搭建基础布局
- [x] 实现用户认证 (登录/注册)

**交付物**
- 可运行的开发环境
- 用户可以注册和登录

---

### Week 2: 文章管理

**任务清单**
- [ ] 创建文章上传页面 (`/upload`)
  - 标题输入框 (受控组件)
  - 内容文本域 (受控组件)
  - 表单验证
  - 提交到 Supabase
- [ ] 创建文章列表页 (`/articles`)
  - 获取用户文章
  - 卡片式展示
  - 点击跳转详情
- [ ] 基础路由导航
  - Header 导航栏
  - 用户菜单

**交付物**
- 用户可以上传文章
- 用户可以查看文章列表

---

### Week 3: GLM 集成 + 文本选择

**任务清单**
- [ ] GLM API 客户端封装
  - 查询单词释义和音标
  - 生成语音音频
  - 上传音频到 Supabase Storage
- [ ] 实现 `useTextSelection` Hook
  - 监听文本选择
  - 计算偏移量
  - 计算浮窗位置
- [ ] 创建选择浮窗组件
  - "添加发音" 按钮
  - 加载状态
  - 错误处理
- [ ] API 路由
  - `/api/pronunciation` (调用 GLM)

**交付物**
- 选中文本后弹出浮窗
- 点击按钮可查询发音并保存

---

### Week 4: 动态渲染系统

**任务清单**
- [ ] `HighlightedText` 组件
  - 按偏移量切分文本
  - 动态插入高亮标记
  - 渲染音标
- [ ] `AnnotatedWord` 组件
  - 高亮样式
  - 悬浮显示音标
  - 点击播放音频
  - 播放状态动画
- [ ] 文章阅读器页面 (`/articles/[id]`)
  - 双栏布局 (文章 + 侧边栏)
  - 响应式设计
- [ ] 音频播放逻辑
  - Web Audio API
  - 播放状态管理

**交付物**
- 文章中标注的单词显示高亮和音标
- 点击单词可播放发音

---

### Week 5: 侧边栏与交互优化

**任务清单**
- [ ] `AnnotationSidebar` 组件
  - 标注列表展示
  - 显示音标、释义、上下文
  - 播放按钮
  - 跳转到原文
  - 删除功能
- [ ] 跳转逻辑
  - 滚动到指定位置
  - 临时高亮动画
- [ ] 删除功能
  - 二次确认
  - 乐观更新
- [ ] Zustand 状态管理
  - 标注列表状态
  - 选中状态
  - 播放状态

**交付物**
- 完整的侧边栏功能
- 流畅的用户交互体验

---

### Week 6: 测试与优化

**任务清单**
- [ ] 性能优化
  - 长文章虚拟滚动
  - 图片懒加载
  - 代码分割
- [ ] 样式细节调整
  - 响应式布局完善
  - 深色模式支持
  - 加载骨架屏
- [ ] 错误处理
  - 全局错误边界
  - Toast 提示
  - 网络异常处理
- [ ] 用户测试
  - 修复 Bug
  - 体验优化
- [ ] 部署上线
  - Vercel 部署
  - 环境变量配置
  - 域名绑定

**交付物**
- 稳定可用的 MVP 产品
- 部署到生产环境

---

## 核心技术实现

### 1. 动态高亮渲染

**原理**: 原文和标注分离存储，渲染时根据 `start_offset` 和 `end_offset` 动态匹配并插入高亮标记。

**实现步骤**:
1. 获取文章内容和所有标注
2. 按 `start_offset` 排序标注
3. 遍历标注，切分文本为三类片段:
   - 未标注文本
   - 标注文本 (带高亮和音标)
   - 剩余文本
4. 渲染为 React 组件数组

**优势**:
- 原文不被污染
- 支持标注的增删改
- 易于维护

### 2. 文本偏移量计算

**挑战**: 用户选中的文本在 DOM 树中，需要转换为在纯文本中的偏移量。

**解决方案**:
```typescript
function getTextOffset(container: Element, node: Node, offset: number): number {
  let textOffset = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    if (currentNode === node) {
      return textOffset + offset;
    }
    textOffset += currentNode.textContent?.length || 0;
  }

  return textOffset;
}
```

### 3. GLM API 调用

**查询单词释义**:
```typescript
const response = await axios.post(
  'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  {
    model: 'glm-4-flash',
    messages: [
      {
        role: 'user',
        content: `请提供英文单词 "${word}" 的详细信息，以JSON格式返回：
{
  "phonetic": "IPA音标",
  "definitions": [
    {"pos": "词性", "meaning": "中文释义"}
  ]
}`
      }
    ]
  },
  {
    headers: {
      'Authorization': `Bearer ${GLM_API_KEY}`
    }
  }
);
```

**生成语音**:
```typescript
const response = await axios.post(
  'https://open.bigmodel.cn/api/paas/v4/audio/speech',
  {
    model: 'glm-4-voice',
    input: text,
    voice: 'alloy'
  },
  {
    headers: {
      'Authorization': `Bearer ${GLM_API_KEY}`
    },
    responseType: 'arraybuffer'
  }
);

// 上传到 Supabase Storage
const { data } = await supabase.storage
  .from('pronunciations')
  .upload(`audio/${Date.now()}.mp3`, response.data);
```

---

## 设计规范

### 色彩系统

**主色调**
- Primary: `#3B82F6` (蓝色)
- Success: `#10B981` (绿色)
- Warning: `#F59E0B` (橙色)
- Error: `#EF4444` (红色)

**高亮颜色**
- 发音标注: `#FFF59D` (黄色)

**背景**
- Light: `#FFFFFF` / `#F9FAFB`
- Dark: `#1F2937` / `#111827`

### 字体系统

**字体家族**
- Sans: Geist Sans (已配置)
- Mono: Geist Mono (音标、代码)

**字号层级**
- Heading 1: `36px`
- Heading 2: `28px`
- Body: `18px` (阅读正文)
- Caption: `14px`
- Small: `12px`

**行高**
- 标题: `1.2`
- 正文: `1.8` (舒适阅读)

### 间距系统

基础单位: `4px`

常用间距:
- xs: `4px`
- sm: `8px`
- md: `16px`
- lg: `24px`
- xl: `32px`
- 2xl: `48px`

### 组件规范

**按钮**
- 高度: `40px`
- 圆角: `6px`
- 主按钮: 实心 + 阴影
- 次要按钮: 边框 + 透明背景

**卡片**
- 圆角: `8px`
- 阴影: `shadow-sm` (hover 时 `shadow-md`)
- 边框: `1px solid #E5E7EB`
- 内边距: `24px`

**输入框**
- 高度: `40px`
- 圆角: `6px`
- 边框: `1px solid #D1D5DB`
- Focus: `2px solid #3B82F6`

---

## 环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GLM (智谱AI)
GLM_API_KEY=your_glm_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 依赖清单

```json
{
  "dependencies": {
    "next": "15.2.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.38.4",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "zustand": "^4.4.6",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-popover": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "sonner": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4.0.0",
    "postcss": "^8",
    "eslint": "^9",
    "eslint-config-next": "15.2.2"
  }
}
```

---

## 验收标准

### 功能验收

- [ ] 用户可以注册和登录
- [ ] 用户可以上传文章（标题 + 内容）
- [ ] 用户可以查看文章列表
- [ ] 用户可以阅读文章
- [ ] 用户选中单词后弹出浮窗
- [ ] 点击"添加发音"可查询音标和释义
- [ ] 标注的单词在文章中高亮显示
- [ ] 悬浮/内联显示音标
- [ ] 点击单词可播放发音
- [ ] 侧边栏显示所有标注
- [ ] 可以播放、跳转、删除标注

### 性能验收

- [ ] 首屏加载 < 3s
- [ ] 标注操作响应 < 500ms
- [ ] 音频播放延迟 < 1s
- [ ] 长文章 (10000+ 字) 流畅滚动

### 体验验收

- [ ] 移动端适配良好
- [ ] 深色模式支持
- [ ] 错误提示友好
- [ ] 加载状态清晰
- [ ] 无明显 Bug

---

## 风险与应对

### 技术风险

| 风险 | 影响 | 概率 | 应对方案 |
|------|------|------|----------|
| GLM API 不稳定 | 功能不可用 | 中 | 实现重试机制，备用字典 API |
| 音频生成失败 | 无法播放发音 | 中 | 降级到 Web Speech API |
| 偏移量计算错误 | 高亮位置错误 | 低 | 充分测试，边界情况处理 |
| Supabase 免费额度耗尽 | 服务中断 | 低 | 监控用量，及时升级 |

### 时间风险

| 风险 | 应对 |
|------|------|
| GLM 集成比预期复杂 | Week 3 预留缓冲时间 |
| 动态渲染性能问题 | 优先实现基础功能，性能优化放 Week 6 |
| 测试时间不足 | 开发过程中持续测试，不积压到最后 |

---

## 后续迭代方向

一期 MVP 上线后，根据用户反馈决定二期优先级:

**高优先级**
- 笔记功能 (用户呼声高)
- 网页爬取 (降低使用门槛)

**中优先级**
- 分享图片 (传播价值)
- 订阅系统 (商业化)

**低优先级**
- 知识图谱 (锦上添花)
- 复习系统 (需要足够数据量)

---

**文档版本**: v1.0
**最后更新**: 2025-01-15
