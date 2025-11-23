'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ArticleShareTemplate,
  type ArticleShareData,
} from '@/components/share-templates/ArticleShareTemplate';
import { MinimalistShareTemplate } from '@/components/share-templates/MinimalistShareTemplate';
import { IllustrationShareTemplate } from '@/components/share-templates/IllustrationShareTemplate';
import { AcademicShareTemplate } from '@/components/share-templates/AcademicShareTemplate';
import { generateAndDownload } from '@/lib/share';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';
import type { Article, Annotation } from '@/lib/types/database';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article;
  annotations?: Annotation[];
}

const themes = ['minimalist', 'illustration', 'academic', 'blue', 'orange', 'green', 'purple', 'gray'] as const;

const themeLabels = {
  minimalist: '莫兰迪简约',
  illustration: '手绘插画',
  academic: '学术教科书',
  blue: '清新蓝',
  orange: '温暖橙',
  green: '自然绿',
  purple: '优雅紫',
  gray: '简约灰',
};

export function ShareDialog({ open, onOpenChange, article, annotations = [] }: ShareDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[number]>('minimalist');

  // 准备分享数据
  const shareData: ArticleShareData = {
    title: article?.title || '示例文章标题',
    excerpt: article?.content?.substring(0, 500) || '这是一篇示例文章的摘要内容...',
    wordNotes: annotations
      .filter(a => a.selected_text && a.phonetic && a.definition)
      .map(a => ({
        word: a.selected_text,
        phonetic: a.phonetic || '',
        translation: a.definition?.[0]?.meaning || '',
      }))
      .slice(0, 8), // 最多显示8个单词
    articleCount: undefined, // 可以从用户统计获取
    wordsCount: annotations.length,
    theme: selectedTheme,
  };

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      // 根据主题选择不同的 element ID 和背景色
      let elementId = 'article-share';
      let backgroundColor = '#ffffff';

      if (selectedTheme === 'minimalist') {
        elementId = 'minimalist-share';
        backgroundColor = '#F5F1E8';
      } else if (selectedTheme === 'illustration') {
        elementId = 'illustration-share';
        backgroundColor = '#FFFDF7';
      } else if (selectedTheme === 'academic') {
        elementId = 'academic-share';
        backgroundColor = '#FFFFFF';
      }

      const filename = `article-${article?.title || 'share'}-${selectedTheme}-${Date.now()}.png`;

      await generateAndDownload(
        {
          elementId,
          format: 'png',
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor,
        },
        filename
      );

      toast.success('图片已保存到本地！');
    } catch (error) {
      console.error('生成失败:', error);
      const err = error as Error;
      toast.error(err.message || '生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-0 rounded-[32px] border-0 shadow-2xl">
        {/* 优雅的顶部区域 */}
        <div className="relative overflow-hidden rounded-t-[32px] bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 p-8 sm:p-10">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200 opacity-20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-200 opacity-20 rounded-full blur-3xl" />

          <DialogHeader className="relative">
            <div className="space-y-3">
              <div className="inline-block">
                <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-light">
                  Share Your Learning
                </p>
              </div>
              <DialogTitle className="text-3xl sm:text-4xl font-serif font-light text-slate-800 leading-tight">
                📤 分享文章笔记
              </DialogTitle>
              <DialogDescription className="text-base text-slate-600 font-light leading-relaxed">
                选择您喜欢的主题风格，生成精美的学习笔记分享卡片
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* 主内容区域 */}
        <div className="px-8 sm:px-10 pb-8 sm:pb-10 space-y-8">
          {/* 主题选择 - 卡片式设计 */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-light text-slate-700">
                🎨 选择主题风格
              </h3>
              <span className="text-sm text-slate-400 font-light">
                {annotations.length} 个单词
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`
                    relative group p-4 rounded-2xl border-2 transition-all duration-300 font-light
                    ${selectedTheme === theme
                      ? 'border-rose-400 bg-rose-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="text-center space-y-2">
                    <div className={`
                      w-12 h-12 mx-auto rounded-full transition-all duration-300
                      ${selectedTheme === theme
                        ? 'bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg scale-110'
                        : 'bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-105'
                      }
                    `} />
                    <p className={`
                      text-sm transition-colors duration-300
                      ${selectedTheme === theme
                        ? 'text-rose-600 font-normal'
                        : 'text-slate-600'
                      }
                    `}>
                      {themeLabels[theme]}
                    </p>
                  </div>

                  {selectedTheme === theme && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 预览区 - 更精致的展示 */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-light text-slate-700">
              👁️ 预览效果
            </h3>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-lg overflow-hidden">
              <div className="flex justify-center overflow-x-auto">
                <div className="transform scale-[0.25] sm:scale-[0.3] lg:scale-[0.35] origin-top">
                  {selectedTheme === 'minimalist' ? (
                    <MinimalistShareTemplate
                      data={{
                        title: article?.title || '示例文章标题',
                        content: article?.content || '这是一段示例文章内容...',
                        annotations: annotations,
                        wordsCount: annotations.length,
                      }}
                    />
                  ) : selectedTheme === 'illustration' ? (
                    <IllustrationShareTemplate
                      data={{
                        title: article?.title || '示例文章标题',
                        content: article?.content || '这是一段示例文章内容...',
                        annotations: annotations,
                        wordsCount: annotations.length,
                      }}
                    />
                  ) : selectedTheme === 'academic' ? (
                    <AcademicShareTemplate
                      data={{
                        title: article?.title || '示例文章标题',
                        content: article?.content || '这是一段示例文章内容...',
                        annotations: annotations,
                        wordsCount: annotations.length,
                      }}
                    />
                  ) : (
                    <ArticleShareTemplate data={{ ...shareData, theme: selectedTheme }} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 - 更优雅的布局 */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-initial sm:min-w-[120px] h-12 border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-2xl font-light tracking-wide transition-all duration-300 hover:bg-amber-50 hover:shadow-md"
            >
              取消
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating || !article || annotations.length === 0}
              className="flex-1 sm:flex-initial sm:min-w-[160px] h-12 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-slate-300 disabled:to-slate-300"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  下载图片
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 隐藏的全尺寸模板（用于生成图片） */}
        <div className="fixed -left-[10000px] -top-[10000px]">
          {selectedTheme === 'minimalist' ? (
            <MinimalistShareTemplate
              data={{
                title: article?.title || '示例文章标题',
                content: article?.content || '这是一段示例文章内容...',
                annotations: annotations,
                wordsCount: annotations.length,
              }}
            />
          ) : selectedTheme === 'illustration' ? (
            <IllustrationShareTemplate
              data={{
                title: article?.title || '示例文章标题',
                content: article?.content || '这是一段示例文章内容...',
                annotations: annotations,
                wordsCount: annotations.length,
              }}
            />
          ) : selectedTheme === 'academic' ? (
            <AcademicShareTemplate
              data={{
                title: article?.title || '示例文章标题',
                content: article?.content || '这是一段示例文章内容...',
                annotations: annotations,
                wordsCount: annotations.length,
              }}
            />
          ) : (
            <ArticleShareTemplate data={{ ...shareData, theme: selectedTheme }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
