'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { TextSelection } from '@/hooks/useTextSelection';
import { clearTextSelection } from '@/hooks/useTextSelection';
import { X, Volume2 } from 'lucide-react';

interface SelectionPopoverProps {
  selection: TextSelection;
  articleId: string;
  articleContent: string;
  onSuccess: () => void;
}

interface AnnotationData {
  word: string;
  phonetic?: string;
  definition?: Array<{ pos: string; meaning: string }>;
  audio_url?: string;
}

export function SelectionPopover({
  selection,
  articleId,
  articleContent,
  onSuccess,
}: SelectionPopoverProps) {
  const [loading, setLoading] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0, translateX: '-50%', translateY: '-100%' });
  const [annotationData, setAnnotationData] = useState<AnnotationData | null>(null);
  const [showResult, setShowResult] = useState(false);
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

      // 提取标注数据
      setAnnotationData({
        word: selection.text,
        phonetic: data.annotation?.phonetic,
        definition: data.annotation?.definition,
        audio_url: data.annotation?.audio_url,
      });

      setShowResult(true);
      toast.success('标注添加成功！');

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

  const handleClose = () => {
    clearTextSelection();
    setShowResult(false);
    setAnnotationData(null);
  };

  const handlePlayAudio = () => {
    if (annotationData?.audio_url) {
      const audio = new Audio(annotationData.audio_url);
      audio.play().catch(() => {
        // 降级到 Web Speech API
        playWithWebSpeech(annotationData.word);
      });
    } else if (annotationData?.word) {
      playWithWebSpeech(annotationData.word);
    }
  };

  const playWithWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // 如果显示结果，展示翻译内容
  if (showResult && annotationData) {
    return (
      <div
        ref={popoverRef}
        className="fixed z-50 bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-200 p-4 animate-in fade-in zoom-in duration-300 max-w-sm"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          transform: `translate(${adjustedPosition.translateX}, ${adjustedPosition.translateY})`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-serif font-medium text-slate-800">
              {annotationData.word}
            </h3>
            {annotationData.phonetic && (
              <p className="text-sm text-rose-500 font-mono mt-1">
                {annotationData.phonetic}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-400" />
          </Button>
        </div>

        {/* Definitions */}
        {annotationData.definition && annotationData.definition.length > 0 && (
          <div className="space-y-2 mb-3">
            {annotationData.definition.map((def, idx) => (
              <div key={idx} className="text-sm">
                <span className="text-slate-500 font-medium">{def.pos}</span>{' '}
                <span className="text-slate-700">{def.meaning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Play button */}
        <Button
          size="sm"
          onClick={handlePlayAudio}
          className="w-full bg-rose-400 hover:bg-rose-500 text-white rounded-xl font-light transition-all duration-300 h-9"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          播放发音
        </Button>
      </div>
    );
  }

  // 初始状态，显示"添加发音"按钮
  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl border border-rose-200 p-2 flex gap-2 animate-in fade-in duration-200"
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
        className="whitespace-nowrap text-sm h-9 px-4 bg-rose-400 hover:bg-rose-500 text-white rounded-xl font-light tracking-wide transition-all duration-300 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <span className="inline-block mr-2">
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
            </span>
            <span className="hidden sm:inline">处理中...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <span className="mr-2">🔊</span>
            <span className="hidden sm:inline">添加发音</span>
            <span className="sm:hidden">发音</span>
          </>
        )}
      </Button>
    </div>
  );
}
