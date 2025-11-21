'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      toast.error('密码长度至少为6位');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error('注册失败：' + error.message);
      setLoading(false);
      return;
    }

    toast.success('注册成功！请查收验证邮件');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="pt-12 pb-8 px-8 text-center space-y-3 bg-gradient-to-b from-white/60 to-transparent">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-light">
              Begin Your Journey
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-800 font-light">
              开始学习
            </h1>
            <p className="text-slate-500 font-light">
              用阅读的方式掌握英语
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="px-8 pb-8 space-y-6">
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
                  className="h-12 px-4 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-light text-slate-600 tracking-wide">
                  设置密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6位字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* Confirm password field */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-light text-slate-600 tracking-wide">
                  确认密码
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 px-4 rounded-2xl border-slate-200 focus:border-amber-300 focus:ring-amber-200 bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  注册中
                </span>
              ) : (
                '创建账号'
              )}
            </Button>

            {/* Login link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-slate-500 font-light">
                已有账号？{' '}
                <Link
                  href="/login"
                  className="text-rose-500 hover:text-rose-600 font-normal transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  立即登录
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
