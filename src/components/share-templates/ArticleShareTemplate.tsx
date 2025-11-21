'use client';

import { QRCodeSVG } from 'qrcode.react';

export interface WordNote {
  word: string;
  phonetic: string;
  translation: string;
}

export interface ArticleShareData {
  title: string;
  excerpt: string; // 文章摘要/前几段
  wordNotes: WordNote[];
  articleCount?: number; // 已读文章总数
  wordsCount?: number; // 已标注单词总数
  theme?: 'blue' | 'orange' | 'green' | 'purple' | 'gray';
}

interface ArticleShareTemplateProps {
  data: ArticleShareData;
  showQR?: boolean;
  qrUrl?: string;
}

const themes = {
  blue: {
    gradient: 'from-rose-50 via-amber-50 to-sky-50',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-100',
    cardBg: 'bg-white/90',
    dot: 'bg-rose-400',
    wordBg: 'bg-rose-50',
  },
  orange: {
    gradient: 'from-orange-50 via-amber-50 to-yellow-50',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-100',
    cardBg: 'bg-white/90',
    dot: 'bg-amber-400',
    wordBg: 'bg-amber-50',
  },
  green: {
    gradient: 'from-emerald-50 via-green-50 to-teal-50',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-100',
    cardBg: 'bg-white/90',
    dot: 'bg-emerald-400',
    wordBg: 'bg-emerald-50',
  },
  purple: {
    gradient: 'from-purple-50 via-pink-50 to-rose-50',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-100',
    cardBg: 'bg-white/90',
    dot: 'bg-purple-400',
    wordBg: 'bg-purple-50',
  },
  gray: {
    gradient: 'from-slate-50 via-gray-50 to-zinc-50',
    accent: 'text-slate-600',
    accentBg: 'bg-slate-100',
    cardBg: 'bg-white/90',
    dot: 'bg-slate-400',
    wordBg: 'bg-slate-50',
  },
};

export function ArticleShareTemplate({
  data,
  showQR = true,
  qrUrl = 'https://yourapp.com'
}: ArticleShareTemplateProps) {
  const theme = themes[data.theme || 'blue'];

  // 限制显示的单词数量（最多显示8个）
  const displayWords = data.wordNotes.slice(0, 8);

  return (
    <div
      id="article-share"
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
              Reading Notes
            </span>
          </div>
        </div>

        {/* 主内容区 - 左右布局 */}
        <div className="flex-1 flex gap-6 mb-6">
          {/* 左侧：文章内容 */}
          <div className={`flex-1 ${theme.cardBg} backdrop-blur-xl rounded-[48px] p-10 shadow-2xl border border-white/60 flex flex-col overflow-hidden`}>
            {/* 文章标题 */}
            <h1 className="text-5xl font-light text-slate-800 mb-6 leading-tight line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
              {data.title}
            </h1>

            {/* 文章摘要 */}
            <div className="flex-1 overflow-hidden">
              <p className="text-2xl text-slate-600 font-light leading-relaxed line-clamp-[12]">
                {data.excerpt}
              </p>
            </div>

            {/* 统计信息 */}
            {(data.articleCount || data.wordsCount) && (
              <div className="flex gap-6 mt-6 pt-6 border-t border-slate-200">
                {data.articleCount && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span className="text-lg text-slate-500 font-light">
                      已读 {data.articleCount} 篇
                    </span>
                  </div>
                )}
                {data.wordsCount && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✏️</span>
                    <span className="text-lg text-slate-500 font-light">
                      标注 {data.wordsCount} 词
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧：单词笔记列表 */}
          <div className="w-[340px] flex flex-col gap-4">
            {/* 标题 */}
            <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl px-6 py-4 shadow-lg border border-white/60`}>
              <h2 className="text-2xl font-light text-slate-700 flex items-center gap-2">
                <span>📝</span>
                <span>My Words</span>
              </h2>
            </div>

            {/* 单词列表 */}
            <div className="flex-1 overflow-hidden flex flex-col gap-3">
              {displayWords.map((word, index) => (
                <div
                  key={index}
                  className={`${theme.cardBg} backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/60`}
                >
                  {/* 单词 */}
                  <div className="text-3xl font-light text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {word.word}
                  </div>

                  {/* 音标 */}
                  <div className={`text-lg ${theme.accent} font-mono font-light mb-2`}>
                    {word.phonetic}
                  </div>

                  {/* 中文释义 */}
                  <div className="text-lg text-slate-600 font-light leading-snug line-clamp-2">
                    {word.translation}
                  </div>
                </div>
              ))}

              {/* 如果单词过多，显示省略提示 */}
              {data.wordNotes.length > 8 && (
                <div className={`${theme.wordBg} rounded-2xl p-4 text-center`}>
                  <span className="text-lg text-slate-500 font-light">
                    还有 {data.wordNotes.length - 8} 个单词...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部品牌信息 */}
        <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60`}>
          <div className="flex items-center justify-between">
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
