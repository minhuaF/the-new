'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/Skeleton';

interface ArticleListSkeletonProps {
  /** 显示的骨架卡片数量 */
  count?: number;
}

/**
 * 文章列表骨架屏
 * 在加载数据时显示，提升用户体验
 */
export function ArticleListSkeleton({ count = 6 }: ArticleListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full bg-white/70 backdrop-blur-sm rounded-3xl border-slate-200 overflow-hidden">
          {/* 封面骨架 */}
          <Skeleton className="h-36 rounded-t-3xl rounded-b-none" />

          <CardHeader className="pb-3">
            {/* 标题骨架 */}
            <Skeleton className="h-6 w-3/4 mb-2 rounded-2xl" />
            <Skeleton className="h-6 w-1/2 rounded-2xl" />
          </CardHeader>

          <CardContent className="space-y-3">
            {/* 摘要骨架 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-xl" />
              <Skeleton className="h-4 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-xl" />
            </div>

            {/* 元数据骨架 */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-3 w-16 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
