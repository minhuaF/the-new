-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 标注表（合并发音和笔记）
CREATE TABLE IF NOT EXISTS annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- 选中文本信息
  selected_text TEXT NOT NULL,
  start_offset INT NOT NULL,
  end_offset INT NOT NULL,
  context_sentence TEXT,

  -- 发音数据（一期使用）
  phonetic TEXT,
  audio_url TEXT,
  definition JSONB,

  -- 笔记数据（二期使用）
  note_content TEXT,
  ai_suggestions TEXT,

  -- 视觉样式
  highlight_color TEXT DEFAULT '#FFF59D',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_annotations_article_id ON annotations(article_id);
CREATE INDEX IF NOT EXISTS idx_annotations_user_id ON annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_annotations_start_offset ON annotations(start_offset);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 articles 表添加更新时间触发器
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为 annotations 表添加更新时间触发器
CREATE TRIGGER update_annotations_updated_at
  BEFORE UPDATE ON annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 设置 Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

-- Articles RLS 策略
-- 用户只能查看自己的文章
CREATE POLICY "Users can view their own articles"
  ON articles FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的文章
CREATE POLICY "Users can insert their own articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的文章
CREATE POLICY "Users can update their own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的文章
CREATE POLICY "Users can delete their own articles"
  ON articles FOR DELETE
  USING (auth.uid() = user_id);

-- Annotations RLS 策略
-- 用户只能查看自己的标注
CREATE POLICY "Users can view their own annotations"
  ON annotations FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的标注
CREATE POLICY "Users can insert their own annotations"
  ON annotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的标注
CREATE POLICY "Users can update their own annotations"
  ON annotations FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的标注
CREATE POLICY "Users can delete their own annotations"
  ON annotations FOR DELETE
  USING (auth.uid() = user_id);
