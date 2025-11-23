'use client';

import { useState } from 'react';
import type { Annotation } from '@/lib/types/database';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnnotationSidebarProps {
  annotations: Annotation[];
  onDelete: (id: string) => void;
  onRefresh?: () => void;
}

export function AnnotationSidebar({
  annotations,
  onDelete,
}: AnnotationSidebarProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (annotation: Annotation) => {
    if (annotation.audio_url) {
      const audio = new Audio(annotation.audio_url);
      setPlayingId(annotation.id);

      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        setPlayingId(null);
        playWithWebSpeech(annotation.selected_text);
      };

      audio.play();
    } else {
      playWithWebSpeech(annotation.selected_text);
      setPlayingId(annotation.id);
      setTimeout(() => setPlayingId(null), 2000);
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

  const handleJumpToText = (annotationId: string) => {
    const element = document.querySelector(`[data-annotation-id="${annotationId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 临时高亮动画
      element.classList.add('ring-4', 'ring-rose-400');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-rose-400');
      }, 2000);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-light text-slate-800 text-xl">
          📚 我的标注
        </h2>
        <span className="text-sm text-slate-400 font-light">({annotations.length})</span>
      </div>

      {annotations.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-slate-500 font-light mb-2">还没有标注</p>
          <p className="text-sm text-slate-400 font-light">
            选中单词开始学习吧
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {annotations.map((annotation) => (
            <Card
              key={annotation.id}
              className="hover:shadow-md transition-all duration-300 border-slate-200 rounded-3xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif font-light text-slate-800 mb-1 text-lg">
                      {annotation.selected_text}
                    </h3>
                    {annotation.phonetic && (
                      <p className="text-sm text-rose-500 font-mono font-light">
                        {annotation.phonetic}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <span className="text-lg text-slate-400">⋮</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        onClick={() => handleJumpToText(annotation.id)}
                        className="font-light"
                      >
                        📍 跳转到原文
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(annotation.id)}
                        className="text-red-500 font-light hover:text-red-600"
                      >
                        🗑️ 删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* 释义 */}
                {annotation.definition && annotation.definition.length > 0 && (
                  <div className="text-sm space-y-1 font-light">
                    {annotation.definition.map((def, idx) => (
                      <p key={idx}>
                        <span className="text-slate-500 font-normal">{def.pos}</span>{' '}
                        <span className="text-slate-700">{def.meaning}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* 上下文 */}
                {annotation.context_sentence && (
                  <p className="text-xs text-slate-400 font-light italic border-l-2 border-rose-200 pl-3 py-1">
                    &ldquo;{annotation.context_sentence}&rdquo;
                  </p>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-300 hover:border-rose-400 hover:bg-rose-50 rounded-xl font-light transition-all duration-300"
                    onClick={() => handlePlay(annotation)}
                    disabled={playingId === annotation.id}
                  >
                    {playingId === annotation.id ? (
                      <>
                        <span className="inline-block animate-spin mr-1">🔊</span>
                        播放中...
                      </>
                    ) : (
                      <>🔊 播放</>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-300 hover:border-amber-400 hover:bg-amber-50 rounded-xl font-light transition-all duration-300"
                    onClick={() => handleJumpToText(annotation.id)}
                  >
                    跳转
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
