'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('请填写邮箱和密码');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('登录失败：' + error.message);
      setLoading(false);
      return;
    }

    toast.success('登录成功！');
    router.push('/articles');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="pt-12 pb-8 px-8 text-center space-y-3 bg-gradient-to-b from-white/60 to-transparent">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-light">
              Welcome Back
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-800 font-light">
              欢迎回来
            </h1>
            <p className="text-slate-500 font-light">
              继续你的阅读旅程
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-6">
            <div className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-light text-slate-600 tracking-wide">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 rounded-2xl border-slate-200 focus:border-rose-300 focus:ring-rose-200 bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-light text-slate-600 tracking-wide">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 rounded-2xl border-slate-200 focus:border-rose-300 focus:ring-rose-200 bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  登录中
                </span>
              ) : (
                '登录'
              )}
            </Button>

            {/* Sign up link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-slate-500 font-light">
                还没有账号？{' '}
                <Link
                  href="/signup"
                  className="text-amber-600 hover:text-amber-700 font-normal transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Back to home link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-600 font-light transition-colors duration-200"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
