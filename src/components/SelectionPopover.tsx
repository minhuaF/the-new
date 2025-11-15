'use client';

import { useState } from 'react';
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
    } catch (error: any) {
      console.error('Add pronunciation error:', error);
      toast.error('添加失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex gap-2 animate-in fade-in duration-200"
      style={{
        left: `${selection.position.x}px`,
        top: `${selection.position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Button
        size="sm"
        onClick={handleAddPronunciation}
        disabled={loading}
        className="whitespace-nowrap"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            处理中...
          </>
        ) : (
          <>
            🔊 添加发音
          </>
        )}
      </Button>
    </div>
  );
}
