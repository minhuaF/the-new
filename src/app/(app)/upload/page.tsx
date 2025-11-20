'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Link2, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // URL 提取相关状态
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);

  // 提取 URL 内容
  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('请输入 URL');
      return;
    }

    setExtracting(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '提取失败');
      }

      // 自动填充标题和内容
      setTitle(data.title);
      setContent(data.content);
      toast.success('文章提取成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提取失败';
      toast.error(errorMessage);
    } finally {
      setExtracting(false);
    }
  };

  // 保存文章
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('请填写标题和内容');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('请先登录');
        router.push('/login');
        return;
      }

      // 插入文章
      const { data, error } = await supabase
        .from('articles')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('文章上传成功！');
      router.push(`/articles/${data.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error('上传失败：' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">上传文章</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              粘贴英文文章内容或输入网页链接，开始你的学习之旅
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                <TabsTrigger value="text" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">粘贴文本</span>
                  <span className="sm:hidden">文本</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Link2 className="w-4 h-4" />
                  <span className="hidden sm:inline">输入链接</span>
                  <span className="sm:hidden">链接</span>
                </TabsTrigger>
              </TabsList>

              {/* 粘贴文本 Tab */}
              <TabsContent value="text">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      文章标题
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="例如：How to Order Coffee"
                      className="text-base sm:text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      文章内容（纯文本）
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="粘贴英文文章内容..."
                      className="min-h-[300px] sm:min-h-[400px] font-mono text-sm sm:text-base leading-relaxed"
                      required
                    />
                    <p className="text-xs sm:text-sm text-gray-500">
                      已输入 {content.length} 个字符
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 w-full"
                      size="lg"
                    >
                      {loading ? '上传中...' : '保存文章'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      取消
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* 输入链接 Tab */}
              <TabsContent value="url">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                      网页链接
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="text-base sm:text-lg flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleExtract}
                        disabled={extracting || !url.trim()}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        {extracting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            提取中...
                          </>
                        ) : (
                          '提取文章'
                        )}
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      输入文章链接，系统将自动提取标题和内容
                    </p>
                  </div>

                  {/* 提取后的预览 */}
                  {(title || content) && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-4 border-t">
                      <div className="space-y-2">
                        <label htmlFor="extracted-title" className="text-sm font-medium">
                          文章标题
                        </label>
                        <Input
                          id="extracted-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="文章标题"
                          className="text-base sm:text-lg"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="extracted-content" className="text-sm font-medium">
                          文章内容
                        </label>
                        <Textarea
                          id="extracted-content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="文章内容..."
                          className="min-h-[300px] sm:min-h-[400px] font-mono text-sm sm:text-base leading-relaxed"
                          required
                        />
                        <p className="text-xs sm:text-sm text-gray-500">
                          已提取 {content.length} 个字符
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 w-full"
                          size="lg"
                        >
                          {loading ? '上传中...' : '保存文章'}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setTitle('');
                            setContent('');
                            setUrl('');
                          }}
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          重置
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
