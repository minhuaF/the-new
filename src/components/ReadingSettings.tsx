'use client';

import { useAtom } from 'jotai';
import { fontSizeAtom, lineHeightAtom, readingModeAtom } from '@/store/atoms';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2, Minus, Plus, Eye } from 'lucide-react';

/**
 * 阅读设置组件
 * 提供字号、行高、阅读模式等设置选项
 */
export function ReadingSettings() {
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [lineHeight, setLineHeight] = useAtom(lineHeightAtom);
  const [readingMode, setReadingMode] = useAtom(readingModeAtom);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(28, fontSize + delta));
    setFontSize(newSize);
  };

  const lineHeightOptions: Array<{ value: 1.5 | 1.8 | 2.0; label: string }> = [
    { value: 1.5, label: '紧凑' },
    { value: 1.8, label: '标准' },
    { value: 2.0, label: '宽松' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">阅读设置</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>阅读设置</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* 字号调节 */}
        <div className="px-2 py-2">
          <div className="text-sm font-medium mb-2">字号大小</div>
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFontSizeChange(-2)}
              disabled={fontSize <= 12}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {fontSize}px
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFontSizeChange(2)}
              disabled={fontSize >= 28}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* 行高调节 */}
        <div className="px-2 py-2">
          <div className="text-sm font-medium mb-2">行高</div>
          <div className="flex gap-1">
            {lineHeightOptions.map((option) => (
              <Button
                key={option.value}
                variant={lineHeight === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLineHeight(option.value)}
                className="flex-1 h-8 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* 阅读模式 */}
        <DropdownMenuItem
          onClick={() => setReadingMode(!readingMode)}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          <span className="flex-1">护眼模式</span>
          <span className="text-xs text-gray-500">
            {readingMode ? '已开启' : '已关闭'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
