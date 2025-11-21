'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-light mb-3">
            Add New Article
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 font-light mb-3">
            上传文章
          </h1>
          <p className="text-slate-500 font-light text-base sm:text-lg">
            粘贴英文文章或输入链接，开始你的学习之旅
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-slate-100/50 p-1 rounded-2xl">
                <TabsTrigger
                  value="text"
                  className="flex items-center gap-2 text-sm sm:text-base font-light rounded-xl data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm transition-all duration-300"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">粘贴文本</span>
                  <span className="sm:hidden">文本</span>
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="flex items-center gap-2 text-sm sm:text-base font-light rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all duration-300"
                >
                  <Link2 className="w-4 h-4" />
                  <span className="hidden sm:inline">输入链接</span>
                  <span className="sm:hidden">链接</span>
                </TabsTrigger>
              </TabsList>

              {/* 粘贴文本 Tab */}
              <TabsContent value="text">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="title" className="block text-sm font-light text-slate-600 tracking-wide">
                      文章标题
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="例如：How to Order Coffee"
                      className="h-12 px-4 rounded-2xl border-slate-200 focus:border-rose-300 focus:ring-rose-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="content" className="block text-sm font-light text-slate-600 tracking-wide">
                      文章内容（纯文本）
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="粘贴英文文章内容..."
                      className="min-h-[350px] sm:min-h-[450px] px-4 py-3 rounded-2xl border-slate-200 focus:border-rose-300 focus:ring-rose-200 bg-white/50 backdrop-blur-sm font-mono text-sm sm:text-base leading-relaxed transition-all duration-300"
                      required
                    />
                    <p className="text-xs sm:text-sm text-slate-400 font-light">
                      已输入 {content.length} 个字符
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          上传中
                        </span>
                      ) : (
                        '保存文章'
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="h-12 border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-2xl px-8 font-light tracking-wide transition-all duration-300 hover:bg-amber-50 w-full sm:w-auto"
                    >
                      取消
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* 输入链接 Tab */}
              <TabsContent value="url">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="url" className="block text-sm font-light text-slate-600 tracking-wide">
                      网页链接
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="h-12 px-4 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg flex-1 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        onClick={handleExtract}
                        disabled={extracting || !url.trim()}
                        className="h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                    <p className="text-xs sm:text-sm text-slate-400 font-light">
                      输入文章链接，系统将自动提取标题和内容
                    </p>
                  </div>

                  {/* 提取后的预览 */}
                  {(title || content) && (
                    <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-slate-200">
                      <div className="space-y-3">
                        <label htmlFor="extracted-title" className="block text-sm font-light text-slate-600 tracking-wide">
                          文章标题
                        </label>
                        <Input
                          id="extracted-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="文章标题"
                          className="h-12 px-4 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm text-base sm:text-lg transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="extracted-content" className="block text-sm font-light text-slate-600 tracking-wide">
                          文章内容
                        </label>
                        <Textarea
                          id="extracted-content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="文章内容..."
                          className="min-h-[350px] sm:min-h-[450px] px-4 py-3 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm font-mono text-sm sm:text-base leading-relaxed transition-all duration-300"
                          required
                        />
                        <p className="text-xs sm:text-sm text-slate-400 font-light">
                          已提取 {content.length} 个字符
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              上传中
                            </span>
                          ) : (
                            '保存文章'
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setTitle('');
                            setContent('');
                            setUrl('');
                          }}
                          className="h-12 border-2 border-slate-300 hover:border-rose-400 text-slate-700 rounded-2xl px-8 font-light tracking-wide transition-all duration-300 hover:bg-rose-50 w-full sm:w-auto"
                        >
                          重置
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
