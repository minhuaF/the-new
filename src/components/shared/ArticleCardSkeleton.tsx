import { Skeleton } from './Skeleton'

/**
 * 文章卡片骨架屏
 */
export function ArticleCardSkeleton() {
  return (
    <div className="h-full bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200 overflow-hidden">
      {/* 渐变封面 */}
      <Skeleton className="h-36 w-full rounded-none" />

      {/* 内容区域 */}
      <div className="p-6 space-y-3">
        {/* 标题 */}
        <Skeleton className="h-6 w-3/4 rounded-2xl" />

        {/* 内容预览 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3 rounded-xl" />
        </div>

        {/* 元信息 */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-24 rounded-xl" />
          <Skeleton className="h-4 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * 文章列表骨架屏
 */
export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
