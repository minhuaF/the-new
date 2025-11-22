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

const themes = ['blue', 'orange', 'green', 'purple', 'gray'] as const;

const themeLabels = {
  blue: '清新蓝',
  orange: '温暖橙',
  green: '自然绿',
  purple: '优雅紫',
  gray: '简约灰',
};

export function ShareDialog({ open, onOpenChange, article, annotations = [] }: ShareDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[number]>('blue');

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
      const elementId = 'article-share';
      const filename = `article-${article?.title || 'share'}-${Date.now()}.png`;

      await generateAndDownload(
        {
          elementId,
          format: 'png',
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
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
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
        <DialogHeader>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-light">
              Share Your Learning
            </p>
            <DialogTitle className="text-2xl sm:text-3xl font-serif font-light text-slate-800">
              分享文章笔记
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 font-light">
              选择主题色，生成包含文章内容和单词笔记的分享卡片
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 sm:space-y-8 mt-6">
          {/* 主题选择 */}
          <div className="space-y-3">
            <label className="text-sm font-light text-slate-600 tracking-wide">选择主题色</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme}
                  variant={selectedTheme === theme ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTheme(theme)}
                  className={`
                    text-xs sm:text-sm rounded-xl font-light tracking-wide transition-all duration-300
                    ${selectedTheme === theme
                      ? 'bg-rose-400 hover:bg-rose-500 text-white shadow-md'
                      : 'border-slate-300 hover:border-rose-400 hover:bg-rose-50'
                    }
                  `}
                >
                  {themeLabels[theme]}
                </Button>
              ))}
            </div>
          </div>

          {/* 预览区 */}
          <div className="flex justify-center overflow-x-auto bg-slate-50 rounded-2xl p-4">
            <div className="transform scale-[0.25] sm:scale-[0.3] lg:scale-[0.35] origin-top">
              <ArticleShareTemplate data={{ ...shareData, theme: selectedTheme }} />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1 h-12 border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-2xl font-light tracking-wide transition-all duration-300 hover:bg-amber-50"
            >
              取消
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating || !article || annotations.length === 0}
              className="w-full sm:w-auto order-1 sm:order-2 h-12 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  下载图片
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 隐藏的全尺寸模板（用于生成图片） */}
        <div className="fixed -left-[10000px] -top-[10000px]">
          <ArticleShareTemplate data={{ ...shareData, theme: selectedTheme }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
