'use client'

import { useEffect, useState } from 'react'

/**
 * 响应式媒体查询 Hook
 * @param query - 媒体查询字符串,例如 '(max-width: 768px)'
 * @returns 是否匹配查询条件
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // 初始值
    setMatches(media.matches)

    // 监听变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // 兼容旧版浏览器
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // 降级处理旧版浏览器 API
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])

  return matches
}

// ========== 预定义断点 Hooks ==========

/**
 * 是否为移动端 (< 768px)
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

/**
 * 是否为平板 (768px - 1023px)
 */
export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

/**
 * 是否为桌面端 (>= 1024px)
 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}

/**
 * 用户是否偏好减少动画
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
