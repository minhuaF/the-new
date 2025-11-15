'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Article } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
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
    } catch (error: any) {
      toast.error('加载失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">我的文章</h1>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/upload">
                + 上传新文章
              </Link>
            </Button>

            <Button
              variant="outline"
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
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-semibold mb-4">还没有文章</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {article.title}
                    </h3>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-4 mb-4">
                      {article.content.slice(0, 200)}...
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {formatDistanceToNow(new Date(article.created_at), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                      <span>
                        {article.content.length} 字符
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
