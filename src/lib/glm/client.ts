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
            role: 'system',
            content: `你是一位专业的英语词典专家，精通国际音标(IPA)和词汇释义。你的任务是为英语单词提供准确的音标和释义。

**音标准确性至关重要**：
- 必须使用标准的国际音标(IPA)格式
- 音标必须完全准确，包含所有音节和重音标记
- 对于多音节词，务必标注主重音(ˈ)和次重音(ˌ)
- 仔细检查每个音素符号是否正确

**请在返回结果前，进行以下检查：**
1. 核对单词的音节数是否与音标匹配
2. 确认重音位置是否正确
3. 检查所有IPA符号是否标准且准确
4. 对于常见词汇，参考权威词典（如牛津、剑桥、韦氏）的标注`
          },
          {
            role: 'user',
            content: `请为英文单词 "${word}" 提供详细信息，严格按照以下JSON格式返回，不要添加任何额外的文字说明：

{
  "phonetic": "IPA音标",
  "definitions": [
    {"pos": "词性", "meaning": "中文释义"}
  ]
}

**音标格式要求（重要！）**：
1. 使用完整的IPA格式，包含斜杠: /ˈexample/
2. 多音节词必须标注主重音(ˈ)和次重音(ˌ)的正确位置
3. 美式发音为主，如有英式差异可在备注中说明
4. 确保所有音素符号准确无误

**释义要求**：
1. definitions 数组包含1-3个最常用释义
2. pos 使用标准缩写：n. v. adj. adv. prep. conj. pron. etc.
3. meaning 提供准确的中文释义

**正确示例**：
{
  "phonetic": "/ˌdaɪəˈbiːtiːz/",
  "definitions": [
    {"pos": "n.", "meaning": "糖尿病"}
  ]
}

{
  "phonetic": "/ˈkɒfi/",
  "definitions": [
    {"pos": "n.", "meaning": "咖啡"},
    {"pos": "n.", "meaning": "咖啡色"}
  ]
}

{
  "phonetic": "/ˌʌndərˈstænd/",
  "definitions": [
    {"pos": "v.", "meaning": "理解；明白"}
  ]
}

**错误示例（避免）**：
- /daɪˈbiːtiːz/ ❌ (缺少次重音，重音位置错误)
- /kɒfi/ ❌ (缺少斜杠)
- /'kɒfi/ ❌ (使用了错误的重音符号)

请仔细检查后返回JSON，确保音标准确无误。`,
          },
        ],
        temperature: 0.1, // 极低温度确保输出稳定和准确
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
