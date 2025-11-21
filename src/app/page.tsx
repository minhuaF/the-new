import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-sky-50">
      {/* Hero Section - Editorial Typography */}
      <main className="relative flex flex-col items-center px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-5xl w-full space-y-12 md:space-y-16">
          {/* Main Headline - Magazine Editorial Style */}
          <div className="space-y-6 text-center">
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-rose-400 font-light">
              Your Reading Journey
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] text-slate-800 font-light">
              让阅读
              <br />
              <span className="italic font-light text-amber-600">成为学习</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
              在每一次阅读中自然掌握单词，
              <br className="hidden md:block" />
              用优雅的方式让英文成为你的语言
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="bg-rose-400 hover:bg-rose-500 text-white rounded-full px-8 py-6 text-base font-light tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <Link href="/signup">
                开始阅读
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-slate-300 hover:border-amber-400 text-slate-700 rounded-full px-8 py-6 text-base font-light tracking-wide transition-all duration-300 hover:bg-amber-50"
            >
              <Link href="/login">
                登录
              </Link>
            </Button>
          </div>
        </div>

        {/* Features - Soft Card Design */}
        <div className="max-w-6xl w-full mt-24 md:mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-rose-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-rose-200 to-rose-300 rounded-2xl rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-0"></div>

              <div className="relative space-y-4">
                <div className="text-5xl font-light">
                  <span className="inline-block transition-transform duration-500 group-hover:scale-110">📖</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-800 font-light">
                  智能标注
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-light">
                  选中任意单词即刻获得音标、释义和发音，
                  阅读从此不再中断
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-amber-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-0"></div>

              <div className="relative space-y-4">
                <div className="text-5xl font-light">
                  <span className="inline-block transition-transform duration-500 group-hover:scale-110">🎵</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-800 font-light">
                  发音学习
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-light">
                  点击播放标准发音，
                  在语境中自然掌握每个单词的正确读法
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-sky-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-sky-200 to-sky-300 rounded-2xl rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-0"></div>

              <div className="relative space-y-4">
                <div className="text-5xl font-light">
                  <span className="inline-block transition-transform duration-500 group-hover:scale-110">✨</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-800 font-light">
                  优雅管理
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-light">
                  侧边栏集中展示所有标注，
                  让复习变得轻松而有序
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"></div>
      </main>

      {/* Footer - Minimal Editorial */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm py-8 text-center">
        <p className="text-sm text-slate-400 font-light tracking-wide">
          © 2025 英语学习平台 · 让阅读成为习惯
        </p>
      </footer>
    </div>
  );
}
