# 二期功能规划

## 概述

一期 MVP 完成并验证核心价值后，二期将聚焦于增强用户体验、扩大使用场景、构建商业模式。

## 🎯 实施进度

**最后更新**: 2025-01-16

### ✅ 已完成功能

#### 2. 网页爬取 🌐 (已完成)
- ✅ URL 输入界面
- ✅ Readability.js 内容提取 API
- ✅ 集成到上传页面的 Tab 切换
- ✅ 错误处理和用户提示

**完成时间**: 2025-01-16
**实施内容**:
- 创建 `/api/extract` 端点使用 Readability.js 提取网页内容
- 在上传页面添加"输入链接" Tab，支持 URL 提取和文本粘贴两种方式
- 提供提取进度提示和错误处理
- 支持编辑提取后的内容

#### 3. 分享功能 🎨 (已完成)
- ✅ 单词卡模板
- ✅ 笔记卡模板
- ✅ 学习总结模板
- ✅ 图片生成与下载功能
- ✅ 5 种主题定制 (清新蓝、温暖橙、自然绿、优雅紫、简约灰)

**完成时间**: 2025-01-16
**实施内容**:
- 创建 3 个分享卡片模板组件 (WordCard, NoteCard, LearningSummary)
- 实现 `ShareDialog` 组件支持模板选择和主题切换
- 使用 `html-to-image` 库实现图片生成和下载
- 在文章详情页添加"分享"按钮
- 使用 QR Code 展示应用推广码

### 🚧 待实施功能

---

## 功能清单

### 1. 笔记功能 📝

**背景**: 用户除了查询发音，还需要记录单词/短语的用法、例句、个人理解。

#### 功能点

**1.1 手动笔记**
- 选中文本后，浮窗新增 "📝 添加笔记" 按钮
- 打开笔记编辑器 (富文本)
- 支持格式:
  - 加粗、斜体、下划线
  - 无序列表、有序列表
  - 代码块 (用于记录例句)
  - 链接
- 保存到 `annotations.note_content`

**1.2 AI 自动笔记**
- 编辑器中增加 "✨ AI 生成建议" 按钮
- 调用 GLM 分析单词/短语用法:
  - 基本含义
  - 常见搭配 (collocations)
  - 例句 (2-3 个)
  - 使用场景
  - 易混淆词
- 保存到 `annotations.ai_suggestions`
- 用户可编辑 AI 建议

**1.3 笔记展示**
- 侧边栏标注卡片增加笔记内容
- 可折叠/展开
- 区分用户笔记和 AI 建议

#### 技术实现

**富文本编辑器**: Lexical
```typescript
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// 笔记编辑器组件
export function NoteEditor({ initialContent, onSave }: NoteEditorProps) {
  // Lexical 配置
  const initialConfig = {
    namespace: 'NoteEditor',
    theme: editorTheme,
    onError: (error: Error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>记录你的笔记...</div>}
      />
      <ToolbarPlugin />
      <OnChangePlugin onChange={handleChange} />
      <Button onClick={handleSave}>保存笔记</Button>
    </LexicalComposer>
  );
}
```

**AI 提示词**:
```typescript
const prompt = `
作为英语学习助手，请分析以下单词/短语在给定上下文中的用法：

单词/短语: "${selectedText}"
上下文: "${contextSentence}"
完整文章主题: ${articleTitle}

请提供：
1. **基本含义**: 中文释义
2. **词性**: 名词/动词/形容词等
3. **常见搭配**: 3个常用搭配 (collocations)
4. **例句**: 2个实用例句（附中文翻译）
5. **使用场景**: 适合在什么场合使用
6. **易混淆词**: 如有，列出易混淆的近义词

以 Markdown 格式输出，简洁明了。
`;
```

#### 数据结构

```sql
-- annotations 表已预留字段
ALTER TABLE annotations
  ADD COLUMN note_content TEXT,           -- 用户手动笔记 (Lexical JSON)
  ADD COLUMN ai_suggestions TEXT;         -- AI 生成的建议 (Markdown)
```

#### 开发时间

**预计**: 2-3周

---

### 2. 网页爬取 🌐

**背景**: 用户不想手动复制粘贴，希望直接输入 URL 提取文章。

#### 功能点

**2.1 URL 输入**
- 上传页面增加 "🔗 输入链接" Tab
- 粘贴 URL 后点击 "提取"
- 显示提取进度

**2.2 内容提取**
- 后端使用 Readability.js 算法
- 去除广告、导航、侧边栏
- 保留:
  - 标题
  - 正文
  - 可选：配图 (二期可不做)

**2.3 Chrome 扩展 (备选方案)**
- 用户浏览网页时点击扩展图标
- 一键提取当前页面文章
- 自动同步到平台

#### 技术实现

**方案 A: 服务端爬取**
```typescript
// /app/api/extract/route.ts
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function POST(req: Request) {
  const { url } = await req.json();

  // 1. 获取网页 HTML
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 ...'
    }
  });
  const html = await response.text();

  // 2. 使用 Readability 提取
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    return Response.json({ error: '无法提取文章' }, { status: 400 });
  }

  return Response.json({
    title: article.title,
    content: article.textContent,
    excerpt: article.excerpt
  });
}
```

**方案 B: Chrome 扩展**
```javascript
// content-script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    const article = new Readability(document.cloneNode(true)).parse();

    // 发送到平台后端
    fetch('https://yourapp.com/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        title: article.title,
        content: article.textContent,
        url: window.location.href
      })
    });
  }
});
```

#### 挑战与应对

| 挑战 | 应对方案 |
|------|----------|
| 反爬虫机制 | 使用 Puppeteer 模拟浏览器 |
| 付费墙内容 | 提示用户手动粘贴 |
| 动态加载页面 | Puppeteer + 等待渲染 |
| 提取失败率高 | 提供手动编辑功能 |

#### 开发时间

- 服务端方案: 1-2周
- Chrome 扩展: 2-3周

---

### 3. 分享功能 🎨

**背景**: 用户学习后想分享成果，精美图片能提升分享欲和传播效果。

#### 功能点

**3.1 分享模板**

**模板 1: 单词卡**
- 突出显示: 单词 + 音标 + 释义
- 设计风格: 简约卡片
- 尺寸: 1080x1080 (Instagram Post)

**模板 2: 笔记卡**
- 内容: 选中短语 + 用户笔记 + AI 建议
- 设计: 类似便签纸
- 尺寸: 1080x1920 (Instagram Story)

**模板 3: 学习总结**
- 统计: 本周阅读 X 篇，标注 Y 个单词
- 进度条、图表
- 激励性文案
- 尺寸: 1200x630 (Twitter Card)

**3.2 模板定制**
- 选择颜色主题 (5-8 种预设)
- 选择字体 (2-3 种)
- 是否显示水印/二维码

**3.3 生成与分享**
- 预览图片
- 下载到本地
- 一键分享到社交媒体 (微信、微博、Twitter)
- 保存到个人图库

#### 技术实现

**html-to-image**
```typescript
import { toPng } from 'html-to-image';

export async function generateShareCard(data: ShareCardData) {
  const cardElement = document.getElementById('share-card');

  const dataUrl = await toPng(cardElement, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: '#fff',
    width: 1080,
    height: 1080
  });

  return dataUrl;
}
```

**模板组件示例**
```typescript
// components/share-templates/WordCard.tsx
export function WordCardTemplate({ word, phonetic, definition }: Props) {
  return (
    <div className="w-[1080px] h-[1080px] bg-gradient-to-br from-blue-50 to-purple-50 p-16 flex flex-col justify-between">
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-8xl mb-8">📚</div>
        <h1 className="text-7xl font-bold mb-4">{word}</h1>
        <p className="text-4xl text-blue-600 mb-8">{phonetic}</p>
        <p className="text-3xl text-gray-700 text-center max-w-2xl">
          {definition}
        </p>
      </div>

      {/* 底部品牌信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" className="w-12 h-12" />
          <span className="text-2xl">MyEnglishApp</span>
        </div>
        <QRCode value="https://yourapp.com" size={80} />
      </div>
    </div>
  );
}
```

**存储**
```typescript
// 上传到 Supabase Storage
const blob = await (await fetch(dataUrl)).blob();
const fileName = `share/${userId}/${Date.now()}.png`;

const { data } = await supabase.storage
  .from('public-images')
  .upload(fileName, blob);

// 保存记录到数据库
await supabase.from('shared_images').insert({
  user_id: userId,
  article_id: articleId,
  template_id: 'word-card',
  image_url: data.path
});
```

#### 设计规范

**色彩主题**
1. 清新蓝 (默认)
2. 温暖橙
3. 自然绿
4. 优雅紫
5. 简约灰

**字体**
- 标题: Geist Sans Bold
- 正文: Geist Sans Regular
- 装饰: 手写体 (可选)

**元素**
- Logo 水印 (右下角，透明度 30%)
- 二维码 (可选)
- Slogan: "让英文阅读更简单"

#### 开发时间

**预计**: 3-4周

---

### 4. 订阅与支付 💰

**背景**: 构建可持续的商业模式，通过功能分层实现营收。

#### 定价策略

**免费版**
- 文章存档: 10 篇
- 每篇标注: 50 个
- AI 笔记: 每月 10 次
- 分享模板: 3 个基础款
- 导出: ❌

**高级版 (¥19.9/月 或 ¥199/年)**
- 文章存档: 无限
- 标注数量: 无限
- AI 笔记: 无限
- 分享模板: 20+ 精美模板
- 导出: PDF / Markdown
- 高级发音: 真人发音 (如需要)
- 无广告
- 优先客服支持

#### 功能点

**4.1 订阅管理**
- 查看当前套餐
- 升级到高级版
- 查看使用额度 (进度条)
- 账单历史

**4.2 支付集成**
- Stripe Checkout
- 支持:
  - 信用卡
  - 支付宝
  - 微信支付

**4.3 额度限制**
- 中间件检查用户权限
- 超额时弹窗引导升级
- 软限制: 提示但可继续使用 (前3次)
- 硬限制: 必须升级才能继续

#### 技术实现

**Stripe 集成**
```typescript
// /app/api/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId, plan } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'alipay', 'wechat_pay'],
    line_items: [
      {
        price_data: {
          currency: 'cny',
          product_data: {
            name: plan === 'monthly' ? '高级订阅 - 月付' : '高级订阅 - 年付',
          },
          unit_amount: plan === 'monthly' ? 1990 : 19900,
          recurring: {
            interval: plan === 'monthly' ? 'month' : 'year',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}
```

**Webhook 处理**
```typescript
// /app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await activateSubscription(event.data.object.metadata.userId);
      break;
    case 'customer.subscription.deleted':
      await deactivateSubscription(event.data.object.metadata.userId);
      break;
  }

  return Response.json({ received: true });
}
```

**额度检查中间件**
```typescript
export async function checkQuota(userId: string, action: 'article' | 'annotation' | 'ai_note') {
  const subscription = await getSubscription(userId);
  const usage = await getUsage(userId);

  const limits = {
    free: { article: 10, annotation: 50, ai_note: 10 },
    premium: { article: Infinity, annotation: Infinity, ai_note: Infinity },
  };

  if (usage[action] >= limits[subscription.plan][action]) {
    throw new QuotaExceededError('已达到使用限制');
  }
}
```

#### 数据结构

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free' | 'premium'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  articles_created INT DEFAULT 0,
  annotations_created INT DEFAULT 0,
  ai_notes_generated INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 开发时间

**预计**: 2-3周

---

### 5. 知识图谱 🧠

**背景**: 帮助用户可视化学习网络，发现知识关联。

#### 功能点

**5.1 关系图谱**
- 节点类型:
  - 文章 (蓝色圆形)
  - 单词 (黄色方形)
  - 主题 (绿色菱形)
- 连线:
  - 文章 → 单词 (实线)
  - 单词 → 主题 (虚线)
  - 文章 → 文章 (共同单词，粗细表示关联度)

**5.2 交互**
- 点击节点查看详情
- 拖拽节点调整位置
- 缩放和平移
- 筛选 (只显示某个主题)

**5.3 智能推荐**
- 基于图谱推荐:
  - "学习了 A 单词的用户也学习了 B"
  - "这篇文章与你已读的 X 文章关联度高"

#### 技术实现

**React Flow**
```typescript
import ReactFlow, { Node, Edge } from 'reactflow';

export function KnowledgeGraph({ userId }: Props) {
  const { nodes, edges } = useKnowledgeGraphData(userId);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
```

**数据构建**
```typescript
async function buildKnowledgeGraph(userId: string) {
  // 1. 获取用户所有文章和标注
  const articles = await getArticles(userId);
  const annotations = await getAnnotations(userId);

  // 2. 构建节点
  const nodes: Node[] = [
    ...articles.map(a => ({
      id: `article-${a.id}`,
      type: 'article',
      data: { label: a.title },
      position: calculatePosition(a)
    })),
    ...annotations.map(ann => ({
      id: `word-${ann.id}`,
      type: 'word',
      data: { label: ann.selected_text },
      position: calculatePosition(ann)
    }))
  ];

  // 3. 构建边
  const edges: Edge[] = annotations.map(ann => ({
    id: `edge-${ann.id}`,
    source: `article-${ann.article_id}`,
    target: `word-${ann.id}`
  }));

  return { nodes, edges };
}
```

#### 开发时间

**预计**: 3-4周

---

### 6. 复习系统 📊

**背景**: 学习后需要定期复习，间隔重复是高效记忆方法。

#### 功能点

**6.1 单词卡片**
- 正面: 单词
- 背面: 音标、释义、例句
- 评分: 1-5 星 (完全忘记 → 完美记住)

**6.2 间隔重复算法**
- SM-2 算法
- 根据评分调整复习间隔
- 到期提醒

**6.3 学习统计**
- 今日复习: X 个
- 累计学习: Y 天
- 掌握程度: 饼图
- 学习曲线: 折线图

**6.4 练习模式**
- 听音辨词
- 拼写测试
- 例句填空

#### 技术实现

**SM-2 算法**
```typescript
function calculateNextReview(card: FlashCard, quality: number) {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);

    easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    easeFactor = Math.max(1.3, easeFactor);
  }

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: new Date(Date.now() + interval * 86400000)
  };
}
```

**数据结构**
```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  annotation_id UUID REFERENCES annotations,
  ease_factor FLOAT DEFAULT 2.5,
  interval INT DEFAULT 1,
  repetitions INT DEFAULT 0,
  next_review_date TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 开发时间

**预计**: 2-3周

---

## 优先级排序

基于用户价值和开发成本，建议开发顺序:

### Phase 2.1 (高优先级)
1. **笔记功能** - 补全核心学习闭环
2. **网页爬取** - 降低使用门槛

### Phase 2.2 (中优先级)
3. **分享功能** - 增强传播效应
4. **订阅系统** - 建立商业模式

### Phase 2.3 (低优先级)
5. **知识图谱** - 锦上添花
6. **复习系统** - 需要足够数据积累

---

## 总体时间规划

| 阶段 | 功能 | 时间 | 累计 |
|------|------|------|------|
| 2.1.1 | 笔记功能 | 3周 | 3周 |
| 2.1.2 | 网页爬取 (服务端) | 2周 | 5周 |
| 2.2.1 | 分享功能 | 4周 | 9周 |
| 2.2.2 | 订阅系统 | 3周 | 12周 |
| 2.3.1 | 知识图谱 | 4周 | 16周 |
| 2.3.2 | 复习系统 | 3周 | 19周 |

**总计**: 约 5 个月

---

## 数据库扩展

```sql
-- 分享图片表
CREATE TABLE shared_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  article_id UUID REFERENCES articles,
  template_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订阅表 (已在上文定义)
-- 使用统计表 (已在上文定义)
-- 单词卡片表 (已在上文定义)

-- 知识图谱缓存表
CREATE TABLE knowledge_graph_cache (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  graph_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 依赖新增

```json
{
  "dependencies": {
    // 笔记
    "lexical": "^0.12.5",
    "@lexical/react": "^0.12.5",

    // 爬取
    "@mozilla/readability": "^0.5.0",
    "jsdom": "^23.0.1",
    "puppeteer": "^21.6.0",

    // 分享
    "html-to-image": "^1.11.11",
    "qrcode.react": "^3.1.0",

    // 支付
    "stripe": "^14.5.0",

    // 图谱
    "reactflow": "^11.10.1",
    "d3": "^7.8.5",

    // 图表
    "recharts": "^2.10.3"
  }
}
```

---

**文档版本**: v1.0
**最后更新**: 2025-01-15
