'use client';

import type { Annotation } from '@/lib/types/database';

export interface AcademicShareData {
  title: string;
  content: string; // 完整文章内容
  annotations: Annotation[];
  wordsCount?: number;
  learningDays?: number;
}

interface AcademicShareTemplateProps {
  data: AcademicShareData;
}

// 学术/教科书配色方案
const academicColors = {
  background: '#FFFFFF',       // 纯白背景
  cardBg: '#FAFAFA',           // 浅灰卡片背景
  primary: '#1A1A1A',          // 深黑文字
  secondary: '#4A4A4A',        // 中灰文字
  accent: '#2563EB',           // 蓝色强调
  highlight: '#FEF3C7',        // 黄色高亮
  phonetic: '#059669',         // 绿色音标
  border: '#E5E7EB',           // 浅灰边框
  numberBg: '#EFF6FF',         // 序号背景
  numberText: '#1E40AF',       // 序号文字
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
        // 黄色高亮显示标注的单词
        segments.push(
          <mark
            key={`word-${index}`}
            className="px-1 rounded"
            style={{
              backgroundColor: academicColors.highlight,
              color: academicColors.primary,
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

export function AcademicShareTemplate({
  data,
}: AcademicShareTemplateProps) {
  // 限制内容长度
  const maxContentLength = 1200;
  const displayContent = data.content.length > maxContentLength
    ? data.content.substring(0, maxContentLength) + '...'
    : data.content;

  return (
    <div
      id="academic-share"
      className="relative w-[1080px] min-h-[1440px]"
      style={{
        backgroundColor: academicColors.background,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '60px 80px',
      }}
    >
      {/* 顶部标题栏 */}
      <div className="mb-12">
        <div
          className="inline-block px-6 py-2 mb-6 rounded-lg"
          style={{
            backgroundColor: academicColors.numberBg,
            border: `1px solid ${academicColors.border}`,
          }}
        >
          <span
            className="text-base uppercase tracking-wider"
            style={{
              color: academicColors.numberText,
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            English Learning Notes
          </span>
        </div>

        <h1
          className="text-5xl leading-tight mb-4"
          style={{
            fontFamily: 'Georgia, serif',
            color: academicColors.primary,
            fontWeight: 600,
          }}
        >
          {data.title}
        </h1>

        {data.learningDays && (
          <div
            className="text-base"
            style={{
              color: academicColors.secondary,
              fontWeight: 400,
            }}
          >
            Day {data.learningDays}
          </div>
        )}
      </div>

      {/* 文章内容区 */}
      <div
        className="p-10 rounded-2xl mb-12"
        style={{
          backgroundColor: academicColors.cardBg,
          border: `2px solid ${academicColors.border}`,
        }}
      >
        <div
          className="text-xl leading-relaxed"
          style={{
            color: academicColors.primary,
            fontWeight: 400,
            lineHeight: '2',
            textAlign: 'justify',
          }}
        >
          {renderHighlightedContent(displayContent, data.annotations)}
        </div>
      </div>

      {/* 单词列表区 */}
      {data.annotations.length > 0 && (
        <div
          className="p-10 rounded-2xl"
          style={{
            backgroundColor: academicColors.cardBg,
            border: `2px solid ${academicColors.border}`,
          }}
        >
          <h2
            className="text-3xl mb-8 pb-4"
            style={{
              fontFamily: 'Georgia, serif',
              color: academicColors.primary,
              fontWeight: 600,
              borderBottom: `2px solid ${academicColors.border}`,
            }}
          >
            Vocabulary List
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {data.annotations.map((annotation, index) => (
              <div
                key={annotation.id || index}
                className="flex gap-4"
              >
                {/* 序号 */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: academicColors.numberBg,
                    color: academicColors.numberText,
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {index + 1}
                </div>

                {/* 单词信息 */}
                <div className="flex-1 flex flex-col gap-1">
                  {/* 单词 */}
                  <div
                    className="text-2xl"
                    style={{
                      color: academicColors.primary,
                      fontWeight: 600,
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {annotation.selected_text}
                  </div>

                  {/* 音标 */}
                  {annotation.phonetic && (
                    <div
                      className="text-lg"
                      style={{
                        color: academicColors.phonetic,
                        fontWeight: 500,
                        fontStyle: 'italic',
                      }}
                    >
                      {annotation.phonetic}
                    </div>
                  )}

                  {/* 释义 */}
                  {annotation.definition && annotation.definition.length > 0 && (
                    <div className="text-base mt-1">
                      {annotation.definition.map((def, idx) => (
                        <div key={idx} className="mb-1">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-xs mr-2"
                            style={{
                              backgroundColor: academicColors.numberBg,
                              color: academicColors.numberText,
                              fontWeight: 600,
                            }}
                          >
                            {def.pos}
                          </span>
                          <span
                            style={{
                              color: academicColors.secondary,
                              fontWeight: 400,
                            }}
                          >
                            {def.meaning}
                          </span>
                        </div>
                      ))}
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
        className="mt-12 w-full h-[2px]"
        style={{ backgroundColor: academicColors.border }}
      />
    </div>
  );
}
