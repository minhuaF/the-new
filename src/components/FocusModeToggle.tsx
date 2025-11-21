'use client';

import { useAtom } from 'jotai';
import { focusModeAtom } from '@/store/atoms';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FocusModeToggleProps {
  className?: string;
}

/**
 * 专注模式切换按钮
 * 开启后隐藏侧边栏，提供沉浸式阅读体验
 */
export function FocusModeToggle({ className }: FocusModeToggleProps) {
  const [focusMode, setFocusMode] = useAtom(focusModeAtom);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setFocusMode(!focusMode)}
      className={`border-slate-300 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 rounded-xl font-light ${
        focusMode ? 'bg-amber-100 border-amber-400 text-amber-700' : ''
      } ${className || ''}`}
      title={focusMode ? '退出专注模式' : '进入专注模式'}
    >
      {focusMode ? (
        <Minimize2 className="w-4 h-4" />
      ) : (
        <Maximize2 className="w-4 h-4" />
      )}
      <span className="hidden sm:inline ml-2">
        {focusMode ? '退出专注' : '专注模式'}
      </span>
    </Button>
  );
}
