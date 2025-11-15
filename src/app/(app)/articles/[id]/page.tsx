'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Article, Annotation } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { useTextSelection } from '@/hooks/useTextSelection';
import { SelectionPopover } from '@/components/SelectionPopover';
import { HighlightedText } from '@/components/HighlightedText';
import { AnnotationSidebar } from '@/components/AnnotationSidebar';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  const selection = useTextSelection('.article-content');

  useEffect(() => {
    loadArticle();
    loadAnnotations();
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
    } catch (error: any) {
      console.error('Load article error:', error);
      toast.error('加载文章失败：' + error.message);
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
    } catch (error: any) {
      console.error('Load annotations error:', error);
      toast.error('加载标注失败：' + error.message);
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
    } catch (error: any) {
      console.error('Delete annotation error:', error);
      toast.error('删除失败：' + error.message);
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
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/articles">
                ← 返回列表
              </Link>
            </Button>
            <h1 className="text-2xl font-bold truncate max-w-2xl">{article.title}</h1>
          </div>

          <div className="text-sm text-gray-500">
            {annotations.length} 个标注
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Article Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <HighlightedText
              content={article.content}
              annotations={annotations}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 border-l bg-gray-50 overflow-y-auto">
          <AnnotationSidebar
            annotations={annotations}
            onDelete={handleDeleteAnnotation}
            onRefresh={loadAnnotations}
          />
        </div>
      </div>

      {/* Selection Popover */}
      {selection && article && (
        <SelectionPopover
          selection={selection}
          articleId={article.id}
          articleContent={article.content}
          onSuccess={handleAnnotationCreated}
        />
      )}
    </div>
  );
}
