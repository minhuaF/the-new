import axios from 'axios';
import type { GLMWordInfo } from '@/lib/types/database';

const GLM_API_KEY = process.env.GLM_API_KEY!;
const GLM_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

/**
 * 查询单词的音标和释义
 * @param word 要查询的单词或短语
 * @returns 音标和释义信息
 */
export async function queryWordDefinition(word: string): Promise<GLMWordInfo> {
  try {
    const response = await axios.post(
      `${GLM_BASE_URL}/chat/completions`,
      {
        model: 'glm-4-flash', // 使用快速模型
        messages: [
          {
            role: 'user',
            content: `请提供英文单词或短语 "${word}" 的详细信息，严格按照以下JSON格式返回，不要添加任何额外的文字说明：

{
  "phonetic": "IPA音标格式",
  "definitions": [
    {"pos": "词性(如n., v., adj.等)", "meaning": "中文释义"}
  ]
}

要求：
1. 音标使用标准IPA格式（国际音标）
2. 如果是短语，提供整体的发音建议
3. definitions 数组至少包含1个，最多3个常用释义
4. pos 使用标准英文缩写（n., v., adj., adv., prep.等）
5. 只返回JSON，不要任何其他文字

示例输出：
{
  "phonetic": "/ˈkɒfi/",
  "definitions": [
    {"pos": "n.", "meaning": "咖啡"},
    {"pos": "n.", "meaning": "咖啡色"}
  ]
}`,
          },
        ],
        temperature: 0.3, // 低温度确保输出稳定
      },
      {
        headers: {
          'Authorization': `Bearer ${GLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // 尝试解析 JSON
    try {
      // 移除可能的 markdown 代码块标记
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanContent);

      // 验证返回的数据格式
      if (!parsed.phonetic || !Array.isArray(parsed.definitions)) {
        throw new Error('Invalid GLM response format');
      }

      return parsed;
    } catch {
      console.error('Failed to parse GLM response:', content);
      // 降级处理：返回基础数据
      return {
        phonetic: `/${word}/`,
        definitions: [
          { pos: 'n.', meaning: '(查询失败，请稍后重试)' },
        ],
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('GLM API Error:', error.response?.data || error.message);
      throw new Error('查询单词失败：' + (error.response?.data?.error?.message || error.message));
    }
    throw new Error('查询单词失败：未知错误');
  }
}

/**
 * 生成单词的语音音频
 * @param text 要生成语音的文本
 * @returns 音频文件的 ArrayBuffer
 */
export async function generateAudio(text: string): Promise<ArrayBuffer> {
  try {
    // 注意：GLM-4 目前可能不支持直接的 TTS API
    // 这里提供一个通用的实现框架
    // 如果 GLM 没有 TTS API，可以使用其他服务如 Edge TTS 或浏览器原生 Web Speech API

    const response = await axios.post(
      `${GLM_BASE_URL}/audio/speech`,
      {
        model: 'glm-4-voice', // 假设的语音模型名称
        input: text,
        voice: 'alloy', // 音色选择
        response_format: 'mp3',
      },
      {
        headers: {
          'Authorization': `Bearer ${GLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('GLM Audio Generation Error:', error.response?.data || error.message);
    }
    // 如果 GLM 不支持 TTS，抛出错误让前端使用 Web Speech API
    throw new Error('AUDIO_NOT_SUPPORTED');
  }
}

/**
 * 提取选中文本所在的句子
 * @param content 完整文章内容
 * @param offset 选中文本的起始位置
 * @returns 所在的句子
 */
export function extractSentence(content: string, offset: number): string {
  // 向前查找句子开始位置
  let start = offset;
  while (start > 0) {
    const char = content[start - 1];
    if (char === '.' || char === '!' || char === '?' || char === '\n') {
      break;
    }
    start--;
  }

  // 向后查找句子结束位置
  let end = offset;
  while (end < content.length) {
    const char = content[end];
    if (char === '.' || char === '!' || char === '?') {
      end++;
      break;
    }
    end++;
  }

  return content.slice(start, end).trim();
}
