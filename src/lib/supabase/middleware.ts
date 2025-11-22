import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // 检查环境变量是否存在
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 如果环境变量缺失，直接返回，避免 middleware 崩溃
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing in middleware');
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // 刷新 session - 忽略错误（Edge Runtime 中的网络问题是正常的）
    await supabase.auth.getUser();
  } catch (error) {
    // 静默处理错误，避免日志污染
    // 用户在客户端会重新认证
    console.warn('Supabase auth check failed in middleware:', error instanceof Error ? error.message : 'Unknown error');
  }

  return supabaseResponse;
}
