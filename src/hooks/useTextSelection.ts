import { useEffect, useState, useCallback } from 'react';

export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  position: { x: number; y: number };
  range: Range;
}

/**
 * Hook 用于检测用户的文本选择
 * @param containerSelector 容器选择器，默认为 '.article-content'
 * @returns 当前选择的文本信息，如果没有选择则返回 null
 */
export function useTextSelection(containerSelector = '.article-content'): TextSelection | null {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();

    // 如果没有选择或选择的文本为空，清除 selection
    if (!sel || sel.toString().trim().length === 0) {
      setSelection(null);
      return;
    }

    const text = sel.toString().trim();
    const range = sel.getRangeAt(0);

    // 检查选择是否在指定容器内
    const container = document.querySelector(containerSelector);
    if (!container) {
      setSelection(null);
      return;
    }

    // 检查选择的节点是否在容器内
    const isWithinContainer = container.contains(range.commonAncestorContainer);
    if (!isWithinContainer) {
      setSelection(null);
      return;
    }

    // 计算文本在整个内容中的偏移量
    const { startOffset, endOffset } = calculateTextOffsets(container, range);

    // 获取选择区域的位置（用于显示浮窗）
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 10, // 浮窗显示在选中文本上方
    };

    setSelection({
      text,
      startOffset,
      endOffset,
      position,
      range,
    });
  }, [containerSelector]);

  useEffect(() => {
    // 监听鼠标抬起事件（选择完成）
    document.addEventListener('mouseup', handleSelectionChange);

    // 监听选择变化事件
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return selection;
}

/**
 * 计算选中文本在容器中的字符偏移量
 * @param container 容器元素
 * @param range 选择的 Range 对象
 * @returns 起始和结束偏移量
 */
function calculateTextOffsets(
  container: Element,
  range: Range
): { startOffset: number; endOffset: number } {
  // 创建一个从容器开始到选择开始的 Range
  const preRange = document.createRange();
  preRange.selectNodeContents(container);
  preRange.setEnd(range.startContainer, range.startOffset);

  const startOffset = preRange.toString().length;
  const endOffset = startOffset + range.toString().length;

  return { startOffset, endOffset };
}

/**
 * 辅助函数：清除当前的文本选择
 */
export function clearTextSelection() {
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
  }
}
