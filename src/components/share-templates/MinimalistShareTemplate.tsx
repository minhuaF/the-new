'use client';

import type { Annotation } from '@/lib/types/database';

export interface MinimalistShareData {
  title: string;
  content: string; // 完整文章内容
  annotations: Annotation[];
  wordsCount?: number;
  learningDays?: number;
}

interface MinimalistShareTemplateProps {
  data: MinimalistShareData;
}

// 莫兰迪配色方案
const morandiColors = {
  background: '#F5F1E8',      // 米色背景
  cardBg: '#FEFDFB',          // 奶白卡片
  primary: '#8B7E74',         // 深灰棕
  secondary: '#B8A398',       // 浅灰棕
  accent: '#D4A5A5',          // 玫瑰灰
  highlight: '#E8D5D3',       // 浅粉高亮
  text: '#4A4A4A',            // 深灰文字
  textLight: '#8A8A8A',       // 浅灰文字
  border: '#E0DDD9',          // 边框色
};

/**
 * 将文章内容渲染为带高亮的段落
 */
function renderHighlightedContent(content: string, annotations: Annotation[]) {
  // 创建单词到标注的映射
  const wordToAnnotation = new Map<string, Annotation>();
  annotations.forEach(annotation => {
    const word = annotation.selected_text.toLowerCase();
    if (!wordToAnnotation.has(word)) {
      wordToAnnotation.set(word, annotation);
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
      const annotation = wordToAnnotation.get(word);

      if (annotation) {
        // 高亮显示标注的单词
        segments.push(
          <mark
            key={`word-${index}`}
            className="px-2 py-1 rounded-md"
            style={{
              backgroundColor: morandiColors.highlight,
              color: morandiColors.primary,
              fontWeight: 500,
            }}
          >
            {token}
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

export function MinimalistShareTemplate({
  data,
}: MinimalistShareTemplateProps) {
  // 限制内容长度（避免图片过长）
  const maxContentLength = 1200;
  const displayContent = data.content.length > maxContentLength
    ? data.content.substring(0, maxContentLength) + '...'
    : data.content;

  return (
    <div
      id="minimalist-share"
      className="relative w-[1080px] min-h-[1440px] overflow-hidden"
      style={{
        backgroundColor: morandiColors.background,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '80px 100px',
      }}
    >
      {/* 顶部装饰线 */}
      <div
        className="w-24 h-[2px] mb-12"
        style={{ backgroundColor: morandiColors.secondary }}
      />

      {/* 标题区域 */}
      <div className="mb-16">
        <h1
          className="text-6xl leading-tight mb-6"
          style={{
            fontFamily: 'Georgia, serif',
            color: morandiColors.primary,
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}
        >
          {data.title}
        </h1>

        {/* 装饰性小标签 */}
        <div className="flex gap-4 items-center">
          <div
            className="inline-block px-6 py-2 rounded-full text-sm"
            style={{
              backgroundColor: morandiColors.cardBg,
              color: morandiColors.secondary,
              border: `1px solid ${morandiColors.border}`,
              fontWeight: 300,
              letterSpacing: '0.1em',
            }}
          >
            READING NOTES
          </div>
          {data.learningDays && (
            <div
              className="text-sm"
              style={{
                color: morandiColors.textLight,
                fontWeight: 300,
              }}
            >
              Day {data.learningDays}
            </div>
          )}
        </div>
      </div>

      {/* 主内容区 - 文章内容 */}
      <div
        className="p-10 rounded-3xl mb-12"
        style={{
          backgroundColor: morandiColors.cardBg,
          border: `1px solid ${morandiColors.border}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div
          className="text-2xl leading-relaxed"
          style={{
            color: morandiColors.text,
            fontWeight: 300,
            lineHeight: '2.2',
          }}
        >
          {renderHighlightedContent(displayContent, data.annotations)}
        </div>
      </div>

      {/* 单词列表区 */}
      {data.annotations.length > 0 && (
        <div
          className="p-10 rounded-3xl mb-12"
          style={{
            backgroundColor: morandiColors.cardBg,
            border: `1px solid ${morandiColors.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <h2
            className="text-3xl mb-8"
            style={{
              fontFamily: 'Georgia, serif',
              color: morandiColors.primary,
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            Vocabulary Notes
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {data.annotations.map((annotation, index) => (
              <div
                key={annotation.id || index}
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: morandiColors.background,
                  border: `1px solid ${morandiColors.border}`,
                }}
              >
                <div className="flex flex-col gap-1">
                  <div
                    className="text-xl"
                    style={{
                      color: morandiColors.primary,
                      fontWeight: 500,
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {annotation.selected_text}
                  </div>
                  {annotation.phonetic && (
                    <div
                      className="text-base"
                      style={{
                        color: morandiColors.secondary,
                        fontWeight: 300,
                        fontStyle: 'italic',
                      }}
                    >
                      {annotation.phonetic}
                    </div>
                  )}
                  {annotation.definition && annotation.definition.length > 0 && (
                    <div
                      className="text-base mt-1"
                      style={{
                        color: morandiColors.text,
                        fontWeight: 300,
                        lineHeight: '1.5',
                      }}
                    >
                      {annotation.definition[0].meaning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部装饰线 */}
      <div
        className="w-24 h-[2px] mt-12 ml-auto"
        style={{ backgroundColor: morandiColors.secondary }}
      />
    </div>
  );
}
