import { NextRequest, NextResponse } from 'next/server';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: '请提供 URL' },
        { status: 400 }
      );
    }

    // 验证 URL 格式
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'URL 格式无效' },
        { status: 400 }
      );
    }

    // 获取网页 HTML
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      // 设置超时
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `无法访问网页：${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // 使用 Readability 提取内容
    const dom = new JSDOM(html, { url: validUrl.toString() });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: '无法提取文章内容，请尝试手动粘贴' },
        { status: 400 }
      );
    }

    // 返回提取的内容
    return NextResponse.json({
      title: article.title || '未命名文章',
      content: article.textContent || '',
      excerpt: article.excerpt || '',
      siteName: article.siteName || validUrl.hostname,
      originalUrl: url,
    });

  } catch (error) {
    console.error('提取文章失败:', error);

    const err = error as Error & { name?: string; cause?: { code?: string } };

    // 处理超时错误
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return NextResponse.json(
        { error: '请求超时，请重试或手动粘贴内容' },
        { status: 408 }
      );
    }

    // 处理网络错误
    if (err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: '无法连接到该网站，请检查 URL 是否正确' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '提取失败：' + (err.message || '未知错误') },
      { status: 500 }
    );
  }
}
