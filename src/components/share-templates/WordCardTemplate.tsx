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
    gradient: 'from-blue-50 to-purple-50',
    accent: 'text-blue-600',
    icon: '📘',
  },
  orange: {
    gradient: 'from-orange-50 to-yellow-50',
    accent: 'text-orange-600',
    icon: '📙',
  },
  green: {
    gradient: 'from-green-50 to-emerald-50',
    accent: 'text-green-600',
    icon: '📗',
  },
  purple: {
    gradient: 'from-purple-50 to-pink-50',
    accent: 'text-purple-600',
    icon: '📕',
  },
  gray: {
    gradient: 'from-gray-50 to-slate-50',
    accent: 'text-gray-600',
    icon: '📓',
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
      className={`w-[1080px] h-[1080px] bg-gradient-to-br ${theme.gradient} p-16 flex flex-col justify-between`}
      style={{ fontFamily: 'Geist Sans, system-ui, sans-serif' }}
    >
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-8xl mb-8">{theme.icon}</div>

        <h1 className="text-7xl font-bold mb-4 text-gray-900">
          {data.word}
        </h1>

        <p className={`text-4xl ${theme.accent} mb-8 font-mono`}>
          {data.phonetic}
        </p>

        <p className="text-3xl text-gray-700 text-center max-w-2xl leading-relaxed">
          {data.definition}
        </p>
      </div>

      {/* 底部品牌信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          <div>
            <div className="text-2xl font-semibold text-gray-900">
              English Learning
            </div>
            <div className="text-lg text-gray-600">
              让英文阅读更简单
            </div>
          </div>
        </div>

        {showQR && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <QRCodeSVG value={qrUrl} size={80} />
          </div>
        )}
      </div>
    </div>
  );
}
