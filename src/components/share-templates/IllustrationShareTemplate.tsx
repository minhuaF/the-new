'use client';

import type { Annotation } from '@/lib/types/database';
import {
  WavyLine,
  DoodleBox,
  StarSticker,
  HeartSticker,
  CircleSticker,
} from './decorations/HandDrawnElements';

export interface IllustrationShareData {
  title: string;
  content: string; // 完整文章内容
  annotations: Annotation[];
  wordsCount?: number;
  learningDays?: number;
}

interface IllustrationShareTemplateProps {
  data: IllustrationShareData;
}

// 手绘插画配色方案
const illustrationColors = {
  background: '#FFFDF7',      // 奶油白
  cardBg: '#FFF',             // 纯白卡片
  primary: '#FF9E9E',         // 珊瑚粉
  secondary: '#A8E6CF',       // 薄荷绿
  accent: '#FFD97D',          // 奶油黄
  highlightColors: [          // 彩色马克笔
    '#FFE4E8',  // 浅粉
    '#E0F4F1',  // 浅绿
    '#FFF8E1',  // 浅黄
    '#E8E3FF',  // 浅紫
  ],
  text: '#2C3E50',            // 深蓝灰
  textLight: '#7F8C8D',       // 浅灰
  border: '#FFE5E5',          // 浅粉边框
};

/**
 * 将文章内容渲染为带彩色高亮的段落
 */
function renderHighlightedContent(content: string, annotations: Annotation[]) {
  // 创建单词到标注的映射，并记录每个单词的颜色索引
  const wordToAnnotation = new Map<string, { annotation: Annotation; colorIndex: number }>();
  annotations.forEach((annotation, index) => {
    const word = annotation.selected_text.toLowerCase();
    if (!wordToAnnotation.has(word)) {
      wordToAnnotation.set(word, {
        annotation,
        colorIndex: index % illustrationColors.highlightColors.length,
      });
    }
  });

  // 分词正则：保留单词、空格、标点和换行
  const tokenRegex = /([a-zA-Z0-9'-]+)|(\s+)|([^\w\s]+)|(\n)/g;
  const segments: React.ReactNode[] = [];

  let match;
  let index = 0;

  while ((match = tokenRegex.exec(content)) !== null) {
    const token = match[0];

    // 检查是否是单词
    if (match[1]) {
      const word = token.toLowerCase();
      const wordInfo = wordToAnnotation.get(word);

      if (wordInfo) {
        // 彩色马克笔高亮效果
        const highlightColor = illustrationColors.highlightColors[wordInfo.colorIndex];
        segments.push(
          <mark
            key={`word-${index}`}
            className="px-2 py-1 rounded-md relative inline-block"
            style={{
              backgroundColor: highlightColor,
              color: illustrationColors.text,
              fontWeight: 500,
              transform: `rotate(${Math.random() * 2 - 1}deg)`, // 轻微旋转
            }}
          >
            {token}
            {/* 下划线波浪效果 */}
            <span
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                backgroundColor: highlightColor,
                opacity: 0.6,
                borderRadius: '50%',
              }}
            />
          </mark>
        );
      } else {
        segments.push(<span key={`text-${index}`}>{token}</span>);
      }
    } else if (match[4]) {
      // 换行符
      segments.push(<br key={`br-${index}`} />);
    } else {
      // 空格和标点
      segments.push(<span key={`text-${index}`}>{token}</span>);
    }

    index++;
  }

  return segments;
}

export function IllustrationShareTemplate({
  data,
}: IllustrationShareTemplateProps) {
  // 限制内容长度
  const maxContentLength = 1200;
  const displayContent = data.content.length > maxContentLength
    ? data.content.substring(0, maxContentLength) + '...'
    : data.content;

  return (
    <div
      id="illustration-share"
      className="relative w-[1080px] min-h-[1440px] overflow-hidden"
      style={{
        backgroundColor: illustrationColors.background,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '60px 80px',
      }}
    >
      {/* 背景装饰贴纸 */}
      <div className="absolute top-[100px] right-[100px] opacity-20 transform rotate-12">
        <StarSticker className="w-20 h-20" color={illustrationColors.accent} />
      </div>
      <div className="absolute bottom-[150px] left-[80px] opacity-15 transform -rotate-6">
        <HeartSticker className="w-16 h-16" color={illustrationColors.primary} />
      </div>
      <div className="absolute top-[400px] right-[50px] opacity-12 transform rotate-[-20deg]">
        <CircleSticker className="w-24 h-24" color={illustrationColors.secondary} />
      </div>

      {/* 顶部装饰区 */}
      <div className="mb-12 relative z-10">
        {/* 手写标签 */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="inline-block px-6 py-3 rounded-full relative"
            style={{
              backgroundColor: illustrationColors.primary,
              color: '#FFF',
              transform: 'rotate(-2deg)',
            }}
          >
            <span
              className="text-xl tracking-wide"
              style={{
                fontFamily: 'Comic Sans MS, cursive',
                fontWeight: 600,
              }}
            >
              ✨ 我的学习笔记 📚
            </span>
          </div>
          {data.learningDays && (
            <div
              className="inline-block px-4 py-2 rounded-full"
              style={{
                backgroundColor: illustrationColors.accent,
                color: illustrationColors.text,
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '16px',
                transform: 'rotate(1deg)',
              }}
            >
              第 {data.learningDays} 天 🎉
            </div>
          )}
        </div>

        {/* 波浪线装饰 */}
        <WavyLine className="w-48 mb-8" color={illustrationColors.primary} />

        {/* 标题 */}
        <h1
          className="text-6xl leading-tight mb-6"
          style={{
            fontFamily: 'Comic Sans MS, cursive',
            color: illustrationColors.text,
            fontWeight: 700,
            letterSpacing: '0.01em',
            transform: 'rotate(-1deg)',
            display: 'inline-block',
          }}
        >
          {data.title}
          <span className="ml-4 text-5xl">💡</span>
        </h1>
      </div>

      {/* 主内容区 - 文章内容 */}
      <DoodleBox className="mb-12 p-10 relative z-10" color={illustrationColors.primary}>
        <div
          className="p-8 rounded-3xl"
          style={{
            backgroundColor: illustrationColors.cardBg,
            boxShadow: '0 8px 30px rgba(255, 158, 158, 0.15)',
          }}
        >
          <div
            className="text-2xl leading-relaxed"
            style={{
              color: illustrationColors.text,
              fontWeight: 400,
              lineHeight: '2.2',
            }}
          >
            {renderHighlightedContent(displayContent, data.annotations)}
          </div>
        </div>
      </DoodleBox>

      {/* 单词列表区 */}
      {data.annotations.length > 0 && (
        <div className="mb-12 relative z-10">
          {/* 标题装饰 */}
          <div className="flex items-center gap-4 mb-8">
            <h2
              className="text-4xl"
              style={{
                fontFamily: 'Comic Sans MS, cursive',
                color: illustrationColors.text,
                fontWeight: 700,
                transform: 'rotate(-1deg)',
              }}
            >
              我的单词本 📖
            </h2>
            <WavyLine className="w-32" color={illustrationColors.accent} />
          </div>

          {/* 单词卡片网格 */}
          <div className="grid grid-cols-2 gap-6">
            {data.annotations.map((annotation, index) => {
              const colorIndex = index % illustrationColors.highlightColors.length;
              const highlightColor = illustrationColors.highlightColors[colorIndex];

              return (
                <div
                  key={annotation.id || index}
                  className="p-6 rounded-3xl relative"
                  style={{
                    backgroundColor: illustrationColors.cardBg,
                    border: `3px dashed ${highlightColor}`,
                    transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                  }}
                >
                  {/* 装饰贴纸 */}
                  <div className="absolute top-2 right-2 opacity-30">
                    {index % 3 === 0 ? (
                      <StarSticker className="w-8 h-8" color={highlightColor} />
                    ) : index % 3 === 1 ? (
                      <HeartSticker className="w-8 h-8" color={highlightColor} />
                    ) : (
                      <CircleSticker className="w-8 h-8" color={highlightColor} />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* 单词 */}
                    <div
                      className="text-3xl"
                      style={{
                        color: illustrationColors.text,
                        fontFamily: 'Comic Sans MS, cursive',
                        fontWeight: 700,
                      }}
                    >
                      {annotation.selected_text}
                    </div>

                    {/* 音标 */}
                    {annotation.phonetic && (
                      <div
                        className="text-xl"
                        style={{
                          color: illustrationColors.textLight,
                          fontWeight: 400,
                          fontStyle: 'italic',
                        }}
                      >
                        {annotation.phonetic}
                      </div>
                    )}

                    {/* 释义 */}
                    {annotation.definition && annotation.definition.length > 0 && (
                      <div className="text-lg mt-1">
                        <span
                          className="px-2 py-1 rounded-full text-sm mr-2"
                          style={{
                            backgroundColor: highlightColor,
                            color: illustrationColors.text,
                            fontWeight: 600,
                          }}
                        >
                          {annotation.definition[0].pos}
                        </span>
                        <span
                          style={{
                            color: illustrationColors.text,
                            fontWeight: 400,
                          }}
                        >
                          {annotation.definition[0].meaning}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 底部波浪线装饰 */}
      <div className="mt-8 flex justify-center relative z-10">
        <WavyLine className="w-64" color={illustrationColors.secondary} />
      </div>

      {/* 角落装饰星星 */}
      <div className="absolute bottom-[50px] right-[60px] opacity-25 transform rotate-[-15deg]">
        <StarSticker className="w-14 h-14" color={illustrationColors.secondary} />
      </div>
    </div>
  );
}
