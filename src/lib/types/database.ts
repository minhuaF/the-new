export interface Article {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Annotation {
  id: string;
  article_id: string;
  user_id: string;

  // 选中文本信息
  selected_text: string;
  start_offset: number;
  end_offset: number;
  context_sentence: string | null;

  // 发音数据（一期使用）
  phonetic: string | null;
  audio_url: string | null;
  definition: Definition[] | null;

  // 笔记数据（二期使用）
  note_content: string | null;
  ai_suggestions: string | null;

  // 视觉样式
  highlight_color: string;

  created_at: string;
  updated_at: string;
}

export interface Definition {
  pos: string;  // 词性 (part of speech)
  meaning: string;  // 中文释义
}

// GLM API 响应类型
export interface GLMWordInfo {
  phonetic: string;
  definitions: Definition[];
}
