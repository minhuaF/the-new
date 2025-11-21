'use client';

import Link from 'next/link';
import type { Article } from '@/lib/types/database';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

/**
 * 柔和的渐变色主题池 - Modern Editorial 风格
 * 使用柔和的 rose, amber, sky 色系
 */
const gradients = [
  'from-rose-100/80 to-rose-200/60',      // 柔和玫瑰
  'from-amber-100/80 to-amber-200/60',    // 柔和琥珀
  'from-sky-100/80 to-sky-200/60',        // 柔和天空
  'from-purple-100/80 to-purple-200/60',  // 柔和紫色
  'from-pink-100/80 to-pink-200/60',      // 柔和粉色
  'from-teal-100/80 to-teal-200/60',      // 柔和青色
];

/**
 * 增强的文章卡片组件 - Modern Editorial + Soft Learning 风格
 * 特性：柔和渐变、精致排版、优雅动画
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
    .slice(0, 120);

  return (
    <Link href={`/articles/${article.id}`} className={cn('block group', className)}>
      <div className="h-full bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        {/* 柔和渐变封面 */}
        <div className={cn('relative h-36 bg-gradient-to-br transition-all duration-500 group-hover:scale-105', gradient)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-80">
              📖
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-4">
          {/* 标题 */}
          <h3 className="font-serif text-xl text-slate-800 font-light line-clamp-2 leading-relaxed transition-colors duration-300 group-hover:text-rose-600">
            {article.title}
          </h3>

          {/* 摘要 */}
          <p className="text-sm text-slate-600 font-light line-clamp-3 leading-relaxed">
            {excerpt}...
          </p>

          {/* 元数据 - 更精致的设计 */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-light tracking-wide">
              {formatDistanceToNow(new Date(article.created_at), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            <span className="text-xs text-slate-400 font-light font-mono">
              {Math.ceil(article.content.length / 500)} min
            </span>
          </div>
        </div>

        {/* 底部装饰条 */}
        <div className="h-1 bg-gradient-to-r from-rose-200 via-amber-200 to-sky-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </Link>
  );
}
