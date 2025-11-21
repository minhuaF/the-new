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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-light mb-2">
                  Your Library
                </p>
                <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 font-light">我的文章</h1>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  asChild
                  className="bg-rose-400 hover:bg-rose-500 text-white rounded-2xl px-6 py-5 font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                >
                  <Link href="/upload">
                    + 上传新文章
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-2xl px-6 py-5 font-light tracking-wide transition-all duration-300 hover:bg-amber-50 w-full sm:w-auto"
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ArticleListSkeleton count={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-light mb-2">
                Your Library
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 font-light">我的文章</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                asChild
                className="bg-rose-400 hover:bg-rose-500 text-white rounded-2xl px-6 py-5 font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
              >
                <Link href="/upload">
                  + 上传新文章
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-2xl px-6 py-5 font-light tracking-wide transition-all duration-300 hover:bg-amber-50 w-full sm:w-auto"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {articles.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-block mb-6 text-7xl sm:text-8xl opacity-90">
              <span className="inline-block animate-bounce">📚</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 font-light mb-4">
              开始你的阅读之旅
            </h2>
            <p className="text-slate-500 font-light text-lg mb-8 max-w-md mx-auto leading-relaxed">
              上传你的第一篇英文文章，
              <br className="hidden sm:block" />
              用优雅的方式开始学习
            </p>
            <Button
              size="lg"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-8 py-6 text-base font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <Link href="/upload">
                上传文章
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
    </div>
  );
}
