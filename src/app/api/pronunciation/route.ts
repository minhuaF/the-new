import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { queryWordDefinition, generateAudio, extractSentence } from '@/lib/glm/client';

export async function POST(request: Request) {
  try {
    const { word, articleId, startOffset, endOffset, articleContent } = await request.json();

    // 验证必填参数
    if (!word || !articleId || startOffset === undefined || !articleContent) {
      return NextResponse.json(
        { error: '缺少必填参数' },
        { status: 400 }
      );
    }

    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 1. 调用 GLM 查询单词释义和音标
    const wordInfo = await queryWordDefinition(word);

    // 2. 提取所在句子作为上下文
    const contextSentence = extractSentence(articleContent, startOffset);

    // 3. 尝试生成音频（如果失败则返回 null，由前端使用 Web Speech API）
    let audioUrl: string | null = null;

    try {
      const audioBuffer = await generateAudio(word);

      // 上传音频到 Supabase Storage
      const fileName = `${Date.now()}-${word.replace(/\s+/g, '-')}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from('pronunciations')
        .upload(fileName, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload audio error:', uploadError);
      } else {
        // 获取公开URL
        const { data: { publicUrl } } = supabase.storage
          .from('pronunciations')
          .getPublicUrl(fileName);

        audioUrl = publicUrl;
      }
    } catch (audioError) {
      // 如果是不支持TTS的错误，静默处理
      const errorMessage = audioError instanceof Error ? audioError.message : 'UNKNOWN';
      if (errorMessage === 'AUDIO_NOT_SUPPORTED') {
        console.log('GLM TTS not supported, will use Web Speech API on client');
      } else {
        console.error('Audio generation error:', audioError);
      }
    }

    // 4. 保存标注到数据库
    const { data: annotation, error: insertError } = await supabase
      .from('annotations')
      .insert({
        article_id: articleId,
        user_id: user.id,
        selected_text: word,
        start_offset: startOffset,
        end_offset: endOffset,
        context_sentence: contextSentence,
        phonetic: wordInfo.phonetic,
        audio_url: audioUrl,
        definition: wordInfo.definitions,
        highlight_color: '#FFF59D', // 默认黄色高亮
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert annotation error:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      annotation,
      useWebSpeech: !audioUrl, // 告诉前端是否需要使用 Web Speech API
    });
  } catch (error) {
    console.error('Pronunciation API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '处理失败';

    return NextResponse.json(
      {
        error: errorMessage,
        details: null,
      },
      { status: 500 }
    );
  }
}
