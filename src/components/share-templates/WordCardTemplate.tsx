'use client';

import { QRCodeSVG } from 'qrcode.react';

export interface WordCardData {
  word: string;
  phonetic: string;
  definition: string;
  theme?: 'blue' | 'orange' | 'green' | 'purple' | 'gray';
}

interface WordCardTemplateProps {
  data: WordCardData;
  showQR?: boolean;
  qrUrl?: string;
}

const themes = {
  blue: {
    gradient: 'from-rose-50 via-amber-50 to-sky-50',
    cardBg: 'bg-white/90',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-100',
    dot: 'bg-rose-400',
  },
  orange: {
    gradient: 'from-orange-50 via-amber-50 to-yellow-50',
    cardBg: 'bg-white/90',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-100',
    dot: 'bg-amber-400',
  },
  green: {
    gradient: 'from-emerald-50 via-green-50 to-teal-50',
    cardBg: 'bg-white/90',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-100',
    dot: 'bg-emerald-400',
  },
  purple: {
    gradient: 'from-purple-50 via-pink-50 to-rose-50',
    cardBg: 'bg-white/90',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-100',
    dot: 'bg-purple-400',
  },
  gray: {
    gradient: 'from-slate-50 via-gray-50 to-zinc-50',
    cardBg: 'bg-white/90',
    accent: 'text-slate-600',
    accentBg: 'bg-slate-100',
    dot: 'bg-slate-400',
  },
};

export function WordCardTemplate({
  data,
  showQR = true,
  qrUrl = 'https://yourapp.com'
}: WordCardTemplateProps) {
  const theme = themes[data.theme || 'blue'];

  return (
    <div
      id="share-card"
      className={`relative w-[1080px] h-[1440px] bg-gradient-to-br ${theme.gradient} overflow-hidden`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 装饰性背景圆形 */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />

      {/* 主内容容器 */}
      <div className="relative h-full p-16 flex flex-col">
        {/* 顶部小标签 */}
        <div className="mb-12">
          <div className={`inline-block ${theme.accentBg} px-6 py-3 rounded-full`}>
            <span className={`text-2xl font-light tracking-[0.2em] uppercase ${theme.accent}`}>
              Daily Word
            </span>
          </div>
        </div>

        {/* 主卡片 */}
        <div className={`${theme.cardBg} backdrop-blur-xl rounded-[48px] p-16 shadow-2xl border border-white/60 flex-1 flex flex-col justify-center items-center`}>
          {/* 单词 */}
          <h1 className="text-[120px] font-light text-slate-800 mb-6 leading-none tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {data.word}
          </h1>

          {/* 音标 */}
          <div className={`${theme.accentBg} px-8 py-4 rounded-2xl mb-16`}>
            <p className={`text-5xl ${theme.accent} font-light font-mono`}>
              {data.phonetic}
            </p>
          </div>

          {/* 释义 */}
          <div className="max-w-[800px] text-center">
            <p className="text-4xl text-slate-700 font-light leading-relaxed">
              {data.definition}
            </p>
          </div>
        </div>

        {/* 底部品牌信息 */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg`} />
            <div>
              <div className="text-3xl font-light text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                English Learning
              </div>
              <div className="text-xl text-slate-500 font-light">
                让阅读成为学习
              </div>
            </div>
          </div>

          {showQR && (
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/60">
              <QRCodeSVG value={qrUrl} size={100} level="H" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
