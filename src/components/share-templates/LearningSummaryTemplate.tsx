'use client';

import { QRCodeSVG } from 'qrcode.react';

export interface LearningSummaryData {
  period: string; // e.g., "本周", "本月"
  articlesRead: number;
  wordsAnnotated: number;
  studyDays: number;
  totalStudyTime?: string; // e.g., "3小时"
  theme?: 'blue' | 'orange' | 'green' | 'purple' | 'gray';
}

interface LearningSummaryTemplateProps {
  data: LearningSummaryData;
  showQR?: boolean;
  qrUrl?: string;
}

const themes = {
  blue: {
    gradient: 'from-rose-400 via-amber-400 to-sky-400',
    bgGradient: 'from-rose-50 via-amber-50 to-sky-50',
    accent: 'text-rose-600',
    cardAccent: 'text-rose-500',
    dot: 'bg-rose-400',
  },
  orange: {
    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
    accent: 'text-amber-600',
    cardAccent: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  green: {
    gradient: 'from-emerald-400 via-green-400 to-teal-400',
    bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
    accent: 'text-emerald-600',
    cardAccent: 'text-emerald-500',
    dot: 'bg-emerald-400',
  },
  purple: {
    gradient: 'from-purple-400 via-pink-400 to-rose-400',
    bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    accent: 'text-purple-600',
    cardAccent: 'text-purple-500',
    dot: 'bg-purple-400',
  },
  gray: {
    gradient: 'from-slate-400 via-gray-400 to-zinc-400',
    bgGradient: 'from-slate-50 via-gray-50 to-zinc-50',
    accent: 'text-slate-600',
    cardAccent: 'text-slate-500',
    dot: 'bg-slate-400',
  },
};

export function LearningSummaryTemplate({
  data,
  showQR = true,
  qrUrl = 'https://yourapp.com'
}: LearningSummaryTemplateProps) {
  const theme = themes[data.theme || 'blue'];

  return (
    <div
      id="learning-summary"
      className={`relative w-[1080px] h-[1440px] bg-gradient-to-br ${theme.bgGradient} overflow-hidden`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 装饰性背景圆形 */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />

      {/* 主内容容器 */}
      <div className="relative h-full p-12 flex flex-col">
        {/* 顶部区域 */}
        <div className="mb-10">
          {/* 小标签 */}
          <div className="mb-8">
            <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <span className={`text-2xl font-light tracking-[0.2em] uppercase ${theme.accent}`}>
                Weekly Summary
              </span>
            </div>
          </div>

          {/* 大标题卡片 */}
          <div className={`bg-gradient-to-r ${theme.gradient} rounded-[48px] p-12 text-white shadow-2xl`}>
            <div className="text-7xl mb-6">🎯</div>
            <h1 className="text-6xl font-light mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {data.period}
            </h1>
            <p className="text-3xl font-light opacity-95">
              学习总结
            </p>
          </div>
        </div>

        {/* 统计卡片网格 */}
        <div className="grid grid-cols-2 gap-6 mb-auto">
          {/* 阅读文章数 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
            <div className="text-2xl text-slate-500 font-light mb-3">📚 Articles</div>
            <div className={`text-7xl font-light ${theme.cardAccent} mb-2`}>
              {data.articlesRead}
            </div>
            <div className="text-xl text-slate-400 font-light">篇</div>
          </div>

          {/* 标注单词数 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
            <div className="text-2xl text-slate-500 font-light mb-3">✏️ Words</div>
            <div className={`text-7xl font-light ${theme.cardAccent} mb-2`}>
              {data.wordsAnnotated}
            </div>
            <div className="text-xl text-slate-400 font-light">个</div>
          </div>

          {/* 学习天数 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
            <div className="text-2xl text-slate-500 font-light mb-3">📅 Days</div>
            <div className={`text-7xl font-light ${theme.cardAccent} mb-2`}>
              {data.studyDays}
            </div>
            <div className="text-xl text-slate-400 font-light">天</div>
          </div>

          {/* 学习时长 */}
          {data.totalStudyTime && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
              <div className="text-2xl text-slate-500 font-light mb-3">⏱️ Time</div>
              <div className={`text-6xl font-light ${theme.cardAccent} mb-2`}>
                {data.totalStudyTime}
              </div>
            </div>
          )}
        </div>

        {/* 底部激励 + 品牌 */}
        <div className="mt-8 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg" />
              <div>
                <div className="text-2xl font-light text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                  English Learning
                </div>
                <div className="text-lg text-slate-500 font-light">
                  持续进步 · 成就更好的自己 💪
                </div>
              </div>
            </div>

            {showQR && (
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                <QRCodeSVG value={qrUrl} size={80} level="H" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
