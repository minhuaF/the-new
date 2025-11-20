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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  WordCardTemplate,
  type WordCardData,
} from '@/components/share-templates/WordCardTemplate';
import {
  NoteCardTemplate,
  type NoteCardData,
} from '@/components/share-templates/NoteCardTemplate';
import {
  LearningSummaryTemplate,
  type LearningSummaryData,
} from '@/components/share-templates/LearningSummaryTemplate';
import { generateAndDownload } from '@/lib/share';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 可以传入初始数据
  initialData?: {
    type: 'word' | 'note' | 'summary';
    data: WordCardData | NoteCardData | LearningSummaryData;
  };
}

const themes = ['blue', 'orange', 'green', 'purple', 'gray'] as const;

const themeLabels = {
  blue: '清新蓝',
  orange: '温暖橙',
  green: '自然绿',
  purple: '优雅紫',
  gray: '简约灰',
};

export function ShareDialog({ open, onOpenChange, initialData }: ShareDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[number]>('blue');
  const [activeTab, setActiveTab] = useState<'word' | 'note' | 'summary'>(
    initialData?.type || 'word'
  );

  // 示例数据
  const [wordData, setWordData] = useState<WordCardData>(
    initialData?.type === 'word'
      ? (initialData.data as WordCardData)
      : {
          word: 'serendipity',
          phonetic: '/ˌserənˈdɪpəti/',
          definition: '意外发现珍奇事物的本领；机缘巧合',
          theme: selectedTheme,
        }
  );

  const [noteData, setNoteData] = useState<NoteCardData>(
    initialData?.type === 'note'
      ? (initialData.data as NoteCardData)
      : {
          phrase: 'in the long run',
          context: 'In the long run, investing in education pays off.',
          userNote: '表示"从长远来看"，常用于讨论长期影响和结果',
          aiSuggestion: '**常见搭配**:\n• be worth it in the long run\n• think about the long run\n\n**例句**:\nIn the long run, this strategy will save us money.',
          theme: selectedTheme,
        }
  );

  const [summaryData, setSummaryData] = useState<LearningSummaryData>(
    initialData?.type === 'summary'
      ? (initialData.data as LearningSummaryData)
      : {
          period: '本周',
          articlesRead: 5,
          wordsAnnotated: 42,
          studyDays: 6,
          totalStudyTime: '3.5小时',
          theme: selectedTheme,
        }
  );

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      let elementId: string;
      let filename: string;

      if (activeTab === 'word') {
        elementId = 'share-card';
        filename = `word-card-${wordData.word}-${Date.now()}.png`;
      } else if (activeTab === 'note') {
        elementId = 'note-card';
        filename = `note-card-${Date.now()}.png`;
      } else {
        elementId = 'learning-summary';
        filename = `learning-summary-${Date.now()}.png`;
      }

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

  // 更新主题
  const updateTheme = (theme: (typeof themes)[number]) => {
    setSelectedTheme(theme);
    setWordData({ ...wordData, theme });
    setNoteData({ ...noteData, theme });
    setSummaryData({ ...summaryData, theme });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">生成分享图片</DialogTitle>
          <DialogDescription className="text-sm">
            选择模板和主题，生成精美的学习分享卡片
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* 主题选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">选择主题</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme}
                  variant={selectedTheme === theme ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateTheme(theme)}
                  className="text-xs sm:text-sm"
                >
                  {themeLabels[theme]}
                </Button>
              ))}
            </div>
          </div>

          {/* 模板选择和预览 */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'word' | 'note' | 'summary')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="word" className="text-xs sm:text-sm">单词卡</TabsTrigger>
              <TabsTrigger value="note" className="text-xs sm:text-sm">笔记卡</TabsTrigger>
              <TabsTrigger value="summary" className="text-xs sm:text-sm">学习总结</TabsTrigger>
            </TabsList>

            <TabsContent value="word" className="mt-4 sm:mt-6">
              <div className="flex justify-center overflow-x-auto">
                <div className="transform scale-[0.3] sm:scale-[0.4] lg:scale-50 origin-top">
                  <WordCardTemplate data={wordData} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="note" className="mt-4 sm:mt-6">
              <div className="flex justify-center overflow-x-auto">
                <div className="transform scale-[0.15] sm:scale-[0.2] lg:scale-25 origin-top">
                  <NoteCardTemplate data={noteData} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-4 sm:mt-6">
              <div className="flex justify-center overflow-x-auto">
                <div className="transform scale-[0.3] sm:scale-[0.4] lg:scale-50 origin-top">
                  <LearningSummaryTemplate data={summaryData} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              取消
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full sm:w-auto order-1 sm:order-2"
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
          {activeTab === 'word' && <WordCardTemplate data={wordData} />}
          {activeTab === 'note' && <NoteCardTemplate data={noteData} />}
          {activeTab === 'summary' && <LearningSummaryTemplate data={summaryData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
