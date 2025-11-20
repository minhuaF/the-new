'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { TextSelection } from '@/hooks/useTextSelection';
import { clearTextSelection } from '@/hooks/useTextSelection';

interface SelectionPopoverProps {
  selection: TextSelection;
  articleId: string;
  articleContent: string;
  onSuccess: () => void;
}

export function SelectionPopover({
  selection,
  articleId,
  articleContent,
  onSuccess,
}: SelectionPopoverProps) {
  const [loading, setLoading] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0, translateX: '-50%', translateY: '-100%' });
  const popoverRef = useRef<HTMLDivElement>(null);

  // Adjust popover position to stay within viewport bounds
  useEffect(() => {
    if (!popoverRef.current) return;

    const popover = popoverRef.current;
    const rect = popover.getBoundingClientRect();
    const padding = 8; // Padding from viewport edges

    let x = selection.position.x;
    const y = selection.position.y;
    let translateX = '-50%';
    let translateY = '-100%';

    // Check horizontal boundaries
    const popoverWidth = rect.width;
    const halfWidth = popoverWidth / 2;

    if (x - halfWidth < padding) {
      // Too close to left edge
      x = padding + halfWidth;
      translateX = '-50%';
    } else if (x + halfWidth > window.innerWidth - padding) {
      // Too close to right edge
      x = window.innerWidth - padding - halfWidth;
      translateX = '-50%';
    }

    // Check vertical boundaries
    const popoverHeight = rect.height;

    if (y - popoverHeight - padding < 0) {
      // Not enough space above, show below selection
      translateY = '8px'; // Small offset below selection
    } else {
      // Show above selection (default)
      translateY = 'calc(-100% - 8px)';
    }

    setAdjustedPosition({ x, y, translateX, translateY });
  }, [selection.position.x, selection.position.y]);

  const handleAddPronunciation = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/pronunciation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: selection.text,
          articleId,
          startOffset: selection.startOffset,
          endOffset: selection.endOffset,
          articleContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '添加失败');
      }

      toast.success('标注添加成功！');

      // 清除选择
      clearTextSelection();

      // 通知父组件刷新数据
      onSuccess();
    } catch (error) {
      console.error('Add pronunciation error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('添加失败：' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex gap-2 animate-in fade-in duration-200"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: `translate(${adjustedPosition.translateX}, ${adjustedPosition.translateY})`,
      }}
    >
      <Button
        size="sm"
        onClick={handleAddPronunciation}
        disabled={loading}
        className="whitespace-nowrap text-sm"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-1 sm:mr-2">⏳</span>
            <span className="hidden sm:inline">处理中...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <span className="mr-1">🔊</span>
            <span className="hidden sm:inline">添加发音</span>
            <span className="sm:hidden">发音</span>
          </>
        )}
      </Button>
    </div>
  );
}
