'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { focusModeAtom } from '@/store/atoms';
import { createClient } from '@/lib/supabase/client';
import type { Article, Annotation } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTextSelection } from '@/hooks/useTextSelection';
import { SelectionPopover } from '@/components/SelectionPopover';
import { ArticleContent } from '@/components/ArticleContent';
import { AnnotationSidebar } from '@/components/AnnotationSidebar';
import { ShareDialog } from '@/components/ShareDialog';
import { ReadingSettings } from '@/components/ReadingSettings';
import { ReadingProgress } from '@/components/ReadingProgress';
import { FocusModeToggle } from '@/components/FocusModeToggle';
import { toast } from 'sonner';
import Link from 'next/link';
import { Share2, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusMode] = useAtom(focusModeAtom);

  const selection = useTextSelection('.article-content');

  useEffect(() => {
    loadArticle();
    loadAnnotations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const loadArticle = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('文章不存在');
        router.push('/articles');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Load article error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('加载文章失败：' + errorMessage);
      router.push('/articles');
    } finally {
      setLoading(false);
    }
  };

  const loadAnnotations = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('article_id', articleId)
        .order('start_offset', { ascending: true });

      if (error) throw error;

      setAnnotations(data || []);
    } catch (error) {
      console.error('Load annotations error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('加载标注失败：' + errorMessage);
    }
  };

  const handleAnnotationCreated = () => {
    // 重新加载标注列表
    loadAnnotations();
  };

  const handleDeleteAnnotation = async (id: string) => {
    if (!confirm('确定要删除这个标注吗？')) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('annotations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('标注已删除');
      loadAnnotations();
    } catch (error) {
      console.error('Delete annotation error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('删除失败：' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Reading Progress Bar */}
      <ReadingProgress scrollContainerSelector=".article-scroll-container" />

      {/* Header */}
      <header
        className={cn(
          'bg-white border-b sticky top-0 z-10 transition-all duration-300',
          focusMode && 'opacity-0 hover:opacity-100'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Back button + Title */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild className="shrink-0">
                <Link href="/articles">
                  <span className="hidden sm:inline">← 返回列表</span>
                  <span className="sm:hidden">←</span>
                </Link>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold truncate">
                {article.title}
              </h1>
            </div>

            {/* Right: Settings + Annotations + Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:block text-sm text-gray-500">
                {annotations.length} 个标注
              </div>

              {/* Reading Settings */}
              <ReadingSettings />

              {/* Focus Mode Toggle */}
              <FocusModeToggle />

              {/* Mobile: Show annotations button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className={cn('lg:hidden', focusMode && 'hidden')}
              >
                <BookMarked className="w-4 h-4" />
                <span className="ml-1 sm:ml-2">{annotations.length}</span>
              </Button>

              {/* Share button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">分享</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Article Content */}
        <div className="flex-1 overflow-y-auto article-scroll-container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className={cn('mx-auto transition-all duration-300', focusMode ? 'max-w-3xl' : 'max-w-4xl')}>
            <ArticleContent content={article.content} annotations={annotations} />
          </div>
        </div>

        {/* Desktop Sidebar - Hidden on mobile and in focus mode */}
        <aside
          className={cn(
            'hidden lg:block lg:w-96 border-l bg-gray-50 overflow-y-auto transition-all duration-300',
            focusMode && 'lg:hidden'
          )}
        >
          <AnnotationSidebar
            annotations={annotations}
            onDelete={handleDeleteAnnotation}
          />
        </aside>
      </div>

      {/* Mobile Sidebar - Sheet Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>我的标注 ({annotations.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(85vh-80px)]">
            <AnnotationSidebar
              annotations={annotations}
              onDelete={handleDeleteAnnotation}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Selection Popover */}
      {selection && article && (
        <SelectionPopover
          selection={selection}
          articleId={article.id}
          articleContent={article.content}
          onSuccess={handleAnnotationCreated}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
