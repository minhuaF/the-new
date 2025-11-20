'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Article } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleListSkeleton } from '@/components/ArticleListSkeleton';
import { toast } from 'sonner';

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadArticles = async () => {
    try {
      const supabase = createClient();

      // 检查用户登录状态
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }

      // 获取文章列表
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('加载失败：' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">我的文章</h1>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/upload">
                    + 上传新文章
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    toast.success('已退出登录');
                    router.push('/');
                  }}
                >
                  退出登录
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Skeleton Loading State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <ArticleListSkeleton count={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">我的文章</h1>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/upload">
                  + 上传新文章
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  toast.success('已退出登录');
                  router.push('/');
                }}
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-6">📚</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">还没有文章</h2>
            <p className="text-gray-600 mb-8">
              上传你的第一篇英文文章，开始学习吧！
            </p>
            <Button size="lg" asChild>
              <Link href="/upload">
                上传文章
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
