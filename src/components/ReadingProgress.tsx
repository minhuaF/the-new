'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { scrollProgressAtom } from '@/store/atoms';

interface ReadingProgressProps {
  /** 滚动容器的 ref 选择器 */
  scrollContainerSelector?: string;
}

/**
 * 阅读进度条组件
 * 显示文章阅读进度，支持点击跳转
 */
export function ReadingProgress({
  scrollContainerSelector = 'main',
}: ReadingProgressProps) {
  const [progress, setProgress] = useAtom(scrollProgressAtom);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.querySelector(scrollContainerSelector);
    if (!container) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) {
        setProgress(0);
        setVisible(false);
        return;
      }

      const currentProgress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setProgress(currentProgress);

      // 滚动超过 100px 时显示进度条
      setVisible(scrollTop > 100);
    };

    // 初始化
    updateProgress();

    // 监听滚动
    container.addEventListener('scroll', updateProgress);

    // 监听窗口大小变化（可能影响滚动高度）
    window.addEventListener('resize', updateProgress);

    return () => {
      container.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [scrollContainerSelector, setProgress]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = document.querySelector(scrollContainerSelector);
    if (!container) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    const { scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    const targetScroll = maxScroll * percentage;

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50 cursor-pointer group"
      onClick={handleProgressClick}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Hover 提示 */}
      <div className="absolute top-full right-4 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
