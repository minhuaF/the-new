import { toPng, toJpeg } from 'html-to-image';

export interface GenerateImageOptions {
  elementId: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * 将 HTML 元素生成为图片
 */
export async function generateImage({
  elementId,
  format = 'png',
  quality = 1.0,
  pixelRatio = 2,
  backgroundColor = '#ffffff',
}: GenerateImageOptions): Promise<string> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const options = {
    quality,
    pixelRatio,
    backgroundColor,
  };

  try {
    if (format === 'jpeg') {
      return await toJpeg(element, options);
    } else {
      return await toPng(element, options);
    }
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw new Error('图片生成失败，请重试');
  }
}

/**
 * 下载图片到本地
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * 生成并下载图片
 */
export async function generateAndDownload(
  options: GenerateImageOptions,
  filename: string
): Promise<void> {
  const dataUrl = await generateImage(options);
  downloadImage(dataUrl, filename);
}

/**
 * 将图片上传到 Supabase Storage
 */
export async function uploadShareImage(
  dataUrl: string,
  userId: string,
  templateId: string
): Promise<string> {
  // 将 data URL 转换为 Blob
  const response = await fetch(dataUrl);
  await response.blob();

  const fileName = `share/${userId}/${templateId}-${Date.now()}.png`;

  // 这里需要导入 Supabase 客户端
  // const { data, error } = await supabase.storage
  //   .from('public-images')
  //   .upload(fileName, blob);

  // if (error) throw error;
  // return data.path;

  // 暂时返回文件名，实际使用时需要取消上面的注释
  return fileName;
}
