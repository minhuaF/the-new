'use client';

import { useAtom } from 'jotai';
import { fontSizeAtom, lineHeightAtom, readingModeAtom } from '@/store/atoms';
import { cn } from '@/lib/utils';
import { HighlightedText } from './HighlightedText';
import type { Annotation } from '@/lib/types/database';

interface ArticleContentProps {
  content: string;
  annotations: Annotation[];
  className?: string;
}

/**
 * 增强的文章内容组件
 * 支持动态字号、行高、阅读模式
 */
export function ArticleContent({
  content,
  annotations,
  className,
}: ArticleContentProps) {
  const [fontSize] = useAtom(fontSizeAtom);
  const [lineHeight] = useAtom(lineHeightAtom);
  const [readingMode] = useAtom(readingModeAtom);

  return (
    <div
      className={cn(
        'article-content prose prose-lg max-w-none transition-all duration-300 font-light text-slate-800',
        readingMode && 'reading-mode',
        className
      )}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight,
      }}
    >
      <HighlightedText content={content} annotations={annotations} />
    </div>
  );
}
