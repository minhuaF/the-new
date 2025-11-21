# UI 组件升级检查清单

**创建时间**: 2025-11-21
**设计风格**: Modern Editorial + Soft Learning

---

## ✅ 已完成升级的组件

### 页面组件
- [x] **首页** (`src/app/page.tsx`)
  - serif 字体标题
  - 柔和渐变背景
  - 三个特性卡片（毛玻璃效果 + hover 动画）
  - 装饰性模糊圆形

- [x] **登录页** (`src/app/(auth)/login/page.tsx`)
  - 毛玻璃卡片 `bg-white/80 backdrop-blur-lg`
  - 圆角 `rounded-3xl`
  - rose 主题色按钮
  - 自定义 loading spinner

- [x] **注册页** (`src/app/(auth)/signup/page.tsx`)
  - 与登录页一致的设计
  - amber 主题色按钮
  - 三个输入字段优雅排列

- [x] **文章列表页** (`src/app/(app)/articles/page.tsx`)
  - 毛玻璃 header
  - "Your Library" 小标签
  - 优化的空状态设计
  - 固定装饰背景元素

- [x] **文章阅读页** (`src/app/(app)/articles/[id]/page.tsx`)
  - 沉浸式背景渐变
  - 毛玻璃 header (focus mode 支持)
  - serif 字体标题
  - 柔和侧边栏

- [x] **上传页** (`src/app/(app)/upload/page.tsx`)
  - 居中卡片布局
  - 精致的 Tabs 设计
  - 圆角输入框
  - 主题色按钮 (rose/amber)

### 功能组件
- [x] **ArticleCard** (`src/components/ArticleCard.tsx`)
  - 6 种柔和渐变主题
  - 透明卡片 `bg-white/70 backdrop-blur-sm`
  - serif 字体标题
  - hover 动画 + 底部装饰条

- [x] **AnnotationSidebar** (`src/components/AnnotationSidebar.tsx`)
  - 支持 `variant="desktop"` 和 `variant="mobile"`
  - serif 字体标题
  - 柔和配色
  - 优化的按钮样式

- [x] **ShareDialog** (`src/components/ShareDialog.tsx`)
  - "Share Your Learning" 标签
  - serif 字体标题
  - 精致的 Tabs (rose/amber/sky 主题色)
  - 圆角按钮 `rounded-2xl`
  - 主题选择按钮优化

- [x] **SelectionPopover** (`src/components/SelectionPopover.tsx`)
  - 毛玻璃效果 `bg-white/90 backdrop-blur-lg`
  - rose 边框 `border-rose-200`
  - 圆角 `rounded-2xl`
  - rose 主题按钮
  - 自定义 loading spinner

---

### 阅读设置相关
- [x] **ReadingSettings** (`src/components/ReadingSettings.tsx`)
  - ✅ 毛玻璃弹出框 `bg-white/95 backdrop-blur-lg`
  - ✅ sky 主题色 (hover:border-sky-400)
  - ✅ 圆角统一 `rounded-2xl` (dropdown) / `rounded-xl` (buttons)
  - ✅ serif 字体标题
  - ✅ font-light 正文

- [x] **FocusModeToggle** (`src/components/FocusModeToggle.tsx`)
  - ✅ amber 主题色 (hover:border-amber-400)
  - ✅ 圆角 `rounded-xl`
  - ✅ 专注模式激活状态样式 (bg-amber-100)
  - ✅ font-light

- [x] **ReadingProgress** (`src/components/ReadingProgress.tsx`)
  - ✅ rose-amber 渐变进度条
  - ✅ slate-200 背景
  - ✅ 精致的 tooltip (rounded-xl, backdrop-blur)

### Skeleton/Loading 组件
- [x] **ArticleListSkeleton** (`src/components/ArticleListSkeleton.tsx`)
  - ✅ 匹配 ArticleCard 设计
  - ✅ 圆角 `rounded-3xl`
  - ✅ 毛玻璃背景 `bg-white/70 backdrop-blur-sm`

- [x] **ArticleCardSkeleton** (`src/components/shared/ArticleCardSkeleton.tsx`)
  - ✅ 圆角 `rounded-3xl`
  - ✅ 毛玻璃背景 `bg-white/70 backdrop-blur-sm`
  - ✅ 统一圆角 (rounded-2xl/xl/lg)

- [x] **LoadingSpinner** (`src/components/shared/LoadingSpinner.tsx`)
  - ✅ rose-400 主题色
  - ✅ LoadingScreen 使用渐变背景
  - ✅ font-light

- [x] **Skeleton** (`src/components/shared/Skeleton.tsx`)
  - ✅ 柔和的 slate-200/60 背景
  - ✅ 圆角 `rounded-xl`
  - ✅ 优化的 shimmer 动画

### 其他组件
- [x] **HighlightedText** (`src/components/HighlightedText.tsx`)
  - ✅ rose-500 音标颜色
  - ✅ 圆角 `rounded-lg`
  - ✅ hover 动画 (scale-105)
  - ✅ font-light

- [x] **ArticleContent** (`src/components/ArticleContent.tsx`)
  - ✅ font-light 排版
  - ✅ slate-800 文本颜色
  - ✅ Editorial 风格

- [x] **EmptyState** (`src/components/shared/EmptyState.tsx`)
  - ✅ serif 字体标题
  - ✅ font-light
  - ✅ slate 配色

- [x] **ErrorBoundary** (`src/components/shared/ErrorBoundary.tsx`)
  - ✅ 渐变背景 (rose-amber-sky)
  - ✅ 毛玻璃卡片 `bg-white/90 backdrop-blur-lg`
  - ✅ 圆角 `rounded-3xl`
  - ✅ serif 字体标题
  - ✅ rose/amber 主题按钮

## 🔄 需要检查/升级的组件

### 布局组件
- [ ] **MobileNav** (`src/components/layouts/MobileNav.tsx`)
  - 检查移动端导航样式

- [ ] **ProgressBar** (`src/components/layouts/ProgressBar.tsx`)
  - 检查是否与 ReadingProgress 重复

### UI 基础组件
大部分 shadcn/ui 组件可能需要微调：
- [ ] Button (`src/components/ui/button.tsx`)
- [ ] Input (`src/components/ui/input.tsx`)
- [ ] Textarea (`src/components/ui/textarea.tsx`)
- [ ] Card (`src/components/ui/card.tsx`)
- [ ] Dialog (`src/components/ui/dialog.tsx`)
- [ ] Sheet (`src/components/ui/sheet.tsx`)
- [ ] Tabs (`src/components/ui/tabs.tsx`)

---

## 🎨 设计规范总结

### 配色方案
```css
/* 主色调 */
rose-50, rose-100, rose-200, rose-400, rose-500, rose-600
amber-50, amber-100, amber-200, amber-400, amber-500, amber-600
sky-50, sky-100, sky-200

/* 中性色 */
slate-100, slate-200, slate-300, slate-400, slate-500, slate-600, slate-700, slate-800

/* 背景渐变 */
bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50
```

### 字体系统
```css
/* 标题 */
font-serif font-light

/* 正文 */
font-light leading-relaxed

/* 标签 */
uppercase tracking-[0.3em] text-xs
```

### 圆角系统
```css
/* 卡片/对话框 */
rounded-3xl

/* 按钮/输入框 */
rounded-2xl

/* Tabs */
rounded-xl
```

### 毛玻璃效果
```css
bg-white/80 backdrop-blur-lg    /* 强毛玻璃 */
bg-white/60 backdrop-blur-sm    /* 中等毛玻璃 */
bg-white/50 backdrop-blur-sm    /* 轻毛玻璃 */
```

### 动画
```css
/* Transitions */
transition-all duration-300
transition-all duration-500

/* Hover Effects */
hover:-translate-y-2
hover:scale-105
hover:scale-[1.02]
hover:shadow-lg
```

### 自定义 Loading Spinner
```tsx
<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
```

---

## 📱 移动端适配检查点

所有组件都需要确保：

1. **响应式间距**
   - 移动端: `gap-2 py-4 px-4`
   - 桌面端: `gap-4 py-6 px-6`

2. **响应式字体**
   - 移动端: `text-sm` / `text-base`
   - 桌面端: `text-lg` / `text-xl`

3. **响应式按钮**
   - 移动端: `w-full`
   - 桌面端: `w-auto`

4. **隐藏/显示内容**
   - 移动端显示: `sm:hidden`
   - 桌面端显示: `hidden sm:inline`

---

## 📊 升级进度总结

### 已完成组件统计
- ✅ **页面组件**: 5/5 (100%)
  - 首页、登录页、注册页、文章列表页、文章阅读页、上传页

- ✅ **功能组件**: 4/4 (100%)
  - ArticleCard, AnnotationSidebar, ShareDialog, SelectionPopover

- ✅ **阅读设置组件**: 3/3 (100%)
  - ReadingSettings, FocusModeToggle, ReadingProgress

- ✅ **Skeleton/Loading 组件**: 4/4 (100%)
  - ArticleListSkeleton, ArticleCardSkeleton, LoadingSpinner, Skeleton

- ✅ **其他核心组件**: 4/4 (100%)
  - HighlightedText, ArticleContent, EmptyState, ErrorBoundary

**总计**: 20+ 个主要组件已完成 Modern Editorial 风格升级

### 待检查组件
- [ ] MobileNav (移动端导航)
- [ ] ProgressBar (可能与 ReadingProgress 重复)
- [ ] UI 基础组件 (Button, Input, Card 等 shadcn/ui 组件)

## 🚀 下一步行动

1. ✅ ~~逐个检查并升级核心组件~~ (已完成)
2. 🔄 检查布局组件 (MobileNav, ProgressBar)
3. 🔄 检查 UI 基础组件是否需要微调
4. 运行完整的视觉测试
5. 确保移动端和桌面端都完美呈现

---

**创建时间**: 2025-11-21
**最后更新**: 2025-11-21 (完成核心组件升级)
