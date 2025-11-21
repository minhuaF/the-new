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
import { cn } from '@/lib/utils';

interface AnnotationSidebarProps {
  annotations: Annotation[];
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function AnnotationSidebar({
  annotations,
  onDelete,
  variant = 'desktop'
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

  const isMobile = variant === 'mobile';

  return (
    <div className={cn(
      isMobile ? 'p-4' : 'p-6'
    )}>
      <div className={cn(
        "flex items-center justify-between mb-6",
        isMobile && "mb-4"
      )}>
        <h2 className={cn(
          "font-serif font-light text-slate-800",
          isMobile ? "text-lg" : "text-xl"
        )}>
          📚 我的标注
        </h2>
        <span className="text-sm text-slate-400 font-light">({annotations.length})</span>
      </div>

      {annotations.length === 0 ? (
        <div className={cn(
          "text-center",
          isMobile ? "py-12" : "py-16"
        )}>
          <div className={cn(
            "mb-4",
            isMobile ? "text-5xl" : "text-6xl"
          )}>✨</div>
          <p className="text-slate-500 font-light mb-2">还没有标注</p>
          <p className="text-sm text-slate-400 font-light">
            选中单词开始学习吧
          </p>
        </div>
      ) : (
        <div className={cn(
          "space-y-4",
          isMobile && "space-y-3"
        )}>
          {annotations.map((annotation) => (
            <Card
              key={annotation.id}
              className={cn(
                "hover:shadow-md transition-all duration-300 border-slate-200",
                isMobile ? "rounded-2xl" : "rounded-3xl"
              )}
            >
              <CardHeader className={cn(
                "pb-3",
                isMobile && "pb-2"
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-serif font-light text-slate-800 mb-1",
                      isMobile ? "text-base" : "text-lg"
                    )}>
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

              <CardContent className={cn(
                "space-y-3 pt-0",
                isMobile && "space-y-2"
              )}>
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
                  <p className={cn(
                    "text-xs text-slate-400 font-light italic border-l-2 border-rose-200 pl-3 py-1",
                    isMobile && "text-xs"
                  )}>
                    &ldquo;{annotation.context_sentence}&rdquo;
                  </p>
                )}

                {/* 操作按钮 */}
                <div className={cn(
                  "flex gap-2 pt-2",
                  isMobile && "gap-2 pt-1"
                )}>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "flex-1 border-slate-300 hover:border-rose-400 hover:bg-rose-50 rounded-xl font-light transition-all duration-300",
                      isMobile && "text-xs h-8"
                    )}
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
                    className={cn(
                      "border-slate-300 hover:border-amber-400 hover:bg-amber-50 rounded-xl font-light transition-all duration-300",
                      isMobile && "text-xs h-8 px-3"
                    )}
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
