'use client';

import { useState } from 'react';
import type { Annotation } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface HighlightedTextProps {
  content: string;
  annotations: Annotation[];
}

export function HighlightedText({ content, annotations }: HighlightedTextProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 按起始位置排序标注
  const sortedAnnotations = [...annotations].sort((a, b) => a.start_offset - b.start_offset);

  // 构建渲染片段
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedAnnotations.forEach((annotation, idx) => {
    // 添加未标注的普通文本
    if (annotation.start_offset > lastIndex) {
      segments.push(
        <span key={`text-${idx}`}>
          {content.slice(lastIndex, annotation.start_offset)}
        </span>
      );
    }

    // 添加标注文本（带高亮和音标）
    segments.push(
      <AnnotatedWord
        key={annotation.id}
        annotation={annotation}
        isPlaying={playingId === annotation.id}
        onPlay={() => handlePlay(annotation)}
      />
    );

    lastIndex = annotation.end_offset;
  });

  // 添加剩余的普通文本
  if (lastIndex < content.length) {
    segments.push(
      <span key="text-end">{content.slice(lastIndex)}</span>
    );
  }

  const handlePlay = (annotation: Annotation) => {
    // 如果有音频URL，使用音频文件
    if (annotation.audio_url) {
      const audio = new Audio(annotation.audio_url);
      setPlayingId(annotation.id);

      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        setPlayingId(null);
        // 降级到 Web Speech API
        playWithWebSpeech(annotation.selected_text);
      };

      audio.play();
    } else {
      // 使用 Web Speech API
      playWithWebSpeech(annotation.selected_text);
      setPlayingId(annotation.id);
      setTimeout(() => setPlayingId(null), 2000); // 2秒后重置状态
    }
  };

  const playWithWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // 慢速
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="article-content text-lg leading-relaxed whitespace-pre-wrap">
      {segments}
    </div>
  );
}

// 单个标注单词组件
interface AnnotatedWordProps {
  annotation: Annotation;
  isPlaying: boolean;
  onPlay: () => void;
}

function AnnotatedWord({ annotation, isPlaying, onPlay }: AnnotatedWordProps) {
  return (
    <span className="inline-block group">
      {/* 高亮文本 */}
      <mark
        className={cn(
          'cursor-pointer transition-all px-1 rounded',
          'hover:shadow-md',
          isPlaying && 'ring-2 ring-blue-400 animate-pulse'
        )}
        style={{ backgroundColor: annotation.highlight_color }}
        onClick={onPlay}
        data-annotation-id={annotation.id}
      >
        {annotation.selected_text}
      </mark>

      {/* 音标（直接显示在单词右边） */}
      {annotation.phonetic && (
        <span className="text-xs text-blue-600 font-mono ml-1 align-middle">
          {annotation.phonetic}
        </span>
      )}

      {/* 播放图标提示 */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-1 align-middle">
        🔊
      </span>
    </span>
  );
}
