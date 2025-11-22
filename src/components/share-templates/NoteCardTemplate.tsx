'use client';

import { QRCodeSVG } from 'qrcode.react';

export interface NoteCardData {
  phrase: string;
  userNote?: string;
  aiSuggestion?: string;
  context?: string;
  theme?: 'blue' | 'orange' | 'green' | 'purple' | 'gray';
}

interface NoteCardTemplateProps {
  data: NoteCardData;
  showQR?: boolean;
  qrUrl?: string;
}

const themes = {
  blue: {
    gradient: 'from-rose-50 via-amber-50 to-sky-50',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-100',
    cardBg: 'bg-white/90',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
  },
  orange: {
    gradient: 'from-orange-50 via-amber-50 to-yellow-50',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-100',
    cardBg: 'bg-white/90',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  green: {
    gradient: 'from-emerald-50 via-green-50 to-teal-50',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-100',
    cardBg: 'bg-white/90',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  purple: {
    gradient: 'from-purple-50 via-pink-50 to-rose-50',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-100',
    cardBg: 'bg-white/90',
    border: 'border-purple-200',
    dot: 'bg-purple-400',
  },
  gray: {
    gradient: 'from-slate-50 via-gray-50 to-zinc-50',
    accent: 'text-slate-600',
    accentBg: 'bg-slate-100',
    cardBg: 'bg-white/90',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function NoteCardTemplate({
  data,
  showQR = true,
  qrUrl = 'https://yourapp.com'
}: NoteCardTemplateProps) {
  const theme = themes[data.theme || 'blue'];

  return (
    <div
      id="note-card"
      className={`relative w-[1080px] h-[1440px] bg-gradient-to-br ${theme.gradient} overflow-hidden`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 装饰性背景圆形 */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${theme.dot} opacity-10 rounded-full blur-3xl`} />

      {/* 主内容容器 */}
      <div className="relative h-full p-12 flex flex-col">
        {/* 顶部标签 */}
        <div className="mb-8">
          <div className={`inline-block ${theme.accentBg} px-6 py-3 rounded-full`}>
            <span className={`text-2xl font-light tracking-[0.2em] uppercase ${theme.accent}`}>
              Learning Note
            </span>
          </div>
        </div>

        {/* 关键词卡片 */}
        <div className={`${theme.cardBg} backdrop-blur-xl rounded-[48px] p-10 shadow-2xl border border-white/60 mb-6`}>
          <div className="text-2xl text-slate-500 font-light mb-3">Key Phrase</div>
          <div className="text-7xl font-light text-slate-800 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {data.phrase}
          </div>
        </div>

        {/* 上下文卡片 */}
        {data.context && (
          <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/60 mb-6`}>
            <div className="text-xl text-slate-500 font-light mb-3">📖 Context</div>
            <div className="text-2xl text-slate-700 font-light leading-relaxed italic">
              &ldquo;{data.context}&rdquo;
            </div>
          </div>
        )}

        {/* 笔记卡片 */}
        {data.userNote && (
          <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/60 mb-6`}>
            <div className="text-xl text-slate-500 font-light mb-3">✍️ My Note</div>
            <div className="text-2xl text-slate-700 font-light leading-relaxed">
              {data.userNote}
            </div>
          </div>
        )}

        {/* AI 建议卡片 */}
        {data.aiSuggestion && (
          <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/60 mb-6`}>
            <div className="text-xl text-slate-500 font-light mb-3">✨ AI Tips</div>
            <div className="text-xl text-slate-700 font-light leading-relaxed whitespace-pre-wrap">
              {data.aiSuggestion}
            </div>
          </div>
        )}

        {/* 底部品牌 */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg" />
            <div>
              <div className="text-2xl font-light text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                English Learning
              </div>
              <div className="text-lg text-slate-500 font-light">
                让阅读成为学习
              </div>
            </div>
          </div>

          {showQR && (
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-3xl shadow-xl border border-white/60">
              <QRCodeSVG value={qrUrl} size={80} level="H" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
