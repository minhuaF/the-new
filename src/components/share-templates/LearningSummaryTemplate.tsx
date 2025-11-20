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
    gradient: 'from-blue-500 to-purple-600',
    bg: 'bg-blue-50',
    accent: 'text-blue-600',
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    accent: 'text-orange-600',
  },
  green: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    accent: 'text-green-600',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50',
    accent: 'text-purple-600',
  },
  gray: {
    gradient: 'from-gray-600 to-slate-700',
    bg: 'bg-gray-50',
    accent: 'text-gray-600',
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
      className="w-[1200px] h-[630px] bg-white flex"
      style={{ fontFamily: 'Geist Sans, system-ui, sans-serif' }}
    >
      {/* 左侧：渐变背景 + 标题 */}
      <div className={`w-1/2 bg-gradient-to-br ${theme.gradient} p-12 flex flex-col justify-between text-white`}>
        <div>
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-bold mb-4">
            {data.period}学习总结
          </h1>
          <p className="text-2xl opacity-90">
            持续进步，成就更好的自己
          </p>
        </div>

        {/* 底部品牌 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur" />
          <div>
            <div className="text-xl font-semibold">English Learning</div>
            <div className="text-sm opacity-80">让英文阅读更简单</div>
          </div>
        </div>
      </div>

      {/* 右侧：统计数据 */}
      <div className={`w-1/2 ${theme.bg} p-12 flex flex-col justify-center`}>
        {/* 统计卡片网格 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 阅读文章数 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-xl text-gray-600 mb-2">阅读文章</div>
            <div className={`text-5xl font-bold ${theme.accent}`}>
              {data.articlesRead}
            </div>
            <div className="text-lg text-gray-500 mt-1">篇</div>
          </div>

          {/* 标注单词数 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-xl text-gray-600 mb-2">标注单词</div>
            <div className={`text-5xl font-bold ${theme.accent}`}>
              {data.wordsAnnotated}
            </div>
            <div className="text-lg text-gray-500 mt-1">个</div>
          </div>

          {/* 学习天数 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-xl text-gray-600 mb-2">学习天数</div>
            <div className={`text-5xl font-bold ${theme.accent}`}>
              {data.studyDays}
            </div>
            <div className="text-lg text-gray-500 mt-1">天</div>
          </div>

          {/* 学习时长 */}
          {data.totalStudyTime && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-xl text-gray-600 mb-2">学习时长</div>
              <div className={`text-4xl font-bold ${theme.accent}`}>
                {data.totalStudyTime}
              </div>
            </div>
          )}
        </div>

        {/* 激励语 + 二维码 */}
        <div className="flex items-center justify-between">
          <div className="text-2xl text-gray-700 font-medium">
            继续加油！💪
          </div>

          {showQR && (
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <QRCodeSVG value={qrUrl} size={80} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
