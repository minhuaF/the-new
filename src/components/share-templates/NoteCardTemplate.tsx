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
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-700',
    label: 'bg-blue-100',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-700',
    label: 'bg-orange-100',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    accent: 'text-green-700',
    label: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'text-purple-700',
    label: 'bg-purple-100',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    accent: 'text-gray-700',
    label: 'bg-gray-100',
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
      className={`w-[1080px] h-[1920px] ${theme.bg} p-16 flex flex-col`}
      style={{ fontFamily: 'Geist Sans, system-ui, sans-serif' }}
    >
      {/* 顶部装饰 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="text-6xl">📝</div>
        <h1 className={`text-5xl font-bold ${theme.accent}`}>
          学习笔记
        </h1>
      </div>

      {/* 短语/单词 */}
      <div className={`${theme.label} rounded-2xl p-8 mb-8`}>
        <div className="text-3xl text-gray-600 mb-2">关键词</div>
        <div className="text-6xl font-bold text-gray-900">
          {data.phrase}
        </div>
      </div>

      {/* 上下文 */}
      {data.context && (
        <div className="mb-8">
          <div className="text-2xl text-gray-600 mb-3">上下文</div>
          <div className={`bg-white border-2 ${theme.border} rounded-xl p-6 text-2xl text-gray-700 leading-relaxed`}>
            &ldquo;{data.context}&rdquo;
          </div>
        </div>
      )}

      {/* 我的笔记 */}
      {data.userNote && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl text-gray-600">✍️ 我的笔记</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-2xl text-gray-800 leading-relaxed">
            {data.userNote}
          </div>
        </div>
      )}

      {/* AI 建议 */}
      {data.aiSuggestion && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl text-gray-600">✨ AI 助手</div>
          </div>
          <div className={`bg-white border-2 ${theme.border} rounded-xl p-6 text-2xl text-gray-700 leading-relaxed whitespace-pre-wrap`}>
            {data.aiSuggestion}
          </div>
        </div>
      )}

      {/* 底部品牌 */}
      <div className="mt-auto pt-8 border-t-2 border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div>
              <div className="text-3xl font-semibold text-gray-900">
                English Learning
              </div>
              <div className="text-xl text-gray-600">
                让英文阅读更简单
              </div>
            </div>
          </div>

          {showQR && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG value={qrUrl} size={100} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
