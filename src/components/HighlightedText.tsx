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

  // 创建单词到标注的映射（用于全文匹配）
  const wordToAnnotation = new Map<string, Annotation>();
  annotations.forEach(annotation => {
    const word = annotation.selected_text.toLowerCase();
    // 只保留第一个标注（或者可以根据 created_at 选择最新的）
    if (!wordToAnnotation.has(word)) {
      wordToAnnotation.set(word, annotation);
    }
  });

  // 将文本分词并渲染
  const segments: React.ReactNode[] = [];

  // 追踪每个单词是否已经显示过音标
  const phoneticShown = new Set<string>();

  // 使用正则分词：保留单词、空格和标点
  const tokenRegex = /([a-zA-Z0-9'-]+)|(\s+)|([^\w\s]+)/g;
  let match;

  while ((match = tokenRegex.exec(content)) !== null) {
    const token = match[0];
    const startIndex = match.index;

    // 检查这个 token 是否是单词
    if (match[1]) {
      // 是单词，检查是否有对应的标注
      const word = token.toLowerCase();
      const annotation = wordToAnnotation.get(word);

      if (annotation) {
        // 判断这个单词是否首次出现
        const showPhonetic = !phoneticShown.has(word);
        if (showPhonetic) {
          phoneticShown.add(word);
        }

        // 所有相同的单词都显示高亮
        segments.push(
          <AnnotatedWord
            key={`word-${startIndex}`}
            annotation={annotation}
            text={token}
            isPlaying={playingId === annotation.id}
            onPlay={() => handlePlay(annotation)}
            isHighlighted={true}
            showPhonetic={showPhonetic}
          />
        );
      } else {
        // 普通单词
        segments.push(
          <span key={`text-${startIndex}`}>{token}</span>
        );
      }
    } else {
      // 空格或标点
      segments.push(
        <span key={`text-${startIndex}`}>{token}</span>
      );
    }
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
  text: string; // 实际显示的文本（保持原始大小写）
  isPlaying: boolean;
  onPlay: () => void;
  isHighlighted: boolean; // 是否是被标注的位置（需要高亮）
  showPhonetic?: boolean; // 是否显示音标（默认 false）
}

function AnnotatedWord({ annotation, text, isPlaying, onPlay, isHighlighted, showPhonetic = false }: AnnotatedWordProps) {
  return (
    <span className="inline-block group">
      {/* 文本（如果是标注位置则高亮） */}
      {isHighlighted ? (
        <mark
          className={cn(
            'cursor-pointer transition-all px-1 rounded-lg font-light',
            'hover:shadow-md hover:scale-105',
            isPlaying && 'ring-2 ring-rose-400 animate-pulse'
          )}
          style={{ backgroundColor: annotation.highlight_color }}
          onClick={onPlay}
          data-annotation-id={annotation.id}
        >
          {text}
        </mark>
      ) : (
        <span
          className={cn(
            'cursor-pointer transition-all',
            isPlaying && 'ring-2 ring-rose-400 animate-pulse'
          )}
          onClick={onPlay}
        >
          {text}
        </span>
      )}

      {/* 音标（仅在首次出现时显示） */}
      {showPhonetic && annotation.phonetic && (
        <span className="text-xs text-rose-500 font-mono font-light ml-1 align-middle">
          {annotation.phonetic}
        </span>
      )}
    </span>
  );
}
