'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Article } from '@/lib/types/database';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

/**
 * 渐变色主题池
 * 使用 oklch 颜色空间实现柔和美观的渐变
 */
const gradients = [
  'from-[oklch(0.85_0.12_260)] to-[oklch(0.75_0.15_280)]', // 紫蓝渐变
  'from-[oklch(0.85_0.12_200)] to-[oklch(0.75_0.15_220)]', // 青蓝渐变
  'from-[oklch(0.85_0.12_160)] to-[oklch(0.75_0.15_180)]', // 青绿渐变
  'from-[oklch(0.85_0.12_140)] to-[oklch(0.75_0.15_160)]', // 绿色渐变
  'from-[oklch(0.85_0.12_40)] to-[oklch(0.75_0.15_60)]',   // 橙黄渐变
  'from-[oklch(0.85_0.12_320)] to-[oklch(0.75_0.15_340)]', // 粉紫渐变
];

/**
 * 增强的文章卡片组件
 * 特性：渐变封面、hover 动画、截断预览
 */
export function ArticleCard({ article, className }: ArticleCardProps) {
  // 根据文章 ID 选择一个一致的渐变色
  const gradientIndex = Math.abs(
    article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % gradients.length;
  const gradient = gradients[gradientIndex];

  // 提取文章摘要（去除换行和多余空格）
  const excerpt = article.content
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);

  return (
    <Link href={`/articles/${article.id}`} className={cn('block group', className)}>
      <Card className="h-full overflow-hidden card-hover">
        {/* 渐变封面 */}
        <div className={cn('h-32 bg-gradient-to-br transition-all duration-300 group-hover:scale-105', gradient)}>
          <div className="h-full flex items-center justify-center">
            <div className="text-white/80 text-4xl">📄</div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-brand-600 transition-colors">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 摘要 */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {excerpt}...
          </p>

          {/* 元数据 */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
            <span>
              {formatDistanceToNow(new Date(article.created_at), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            <span className="font-mono">
              {Math.ceil(article.content.length / 500)} min
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
