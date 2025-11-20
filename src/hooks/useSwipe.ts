'use client'

import { useEffect, RefObject } from 'react'

export interface SwipeCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export interface SwipeOptions {
  /** 触发滑动的最小距离 (px) */
  threshold?: number
  /** 是否阻止默认行为 */
  preventDefault?: boolean
}

/**
 * 滑动手势 Hook (基于 Pointer Events API)
 * @param ref - 目标元素 ref
 * @param callbacks - 滑动回调函数
 * @param options - 配置选项
 */
export function useSwipe(
  ref: RefObject<HTMLElement>,
  callbacks: SwipeCallbacks,
  options: SwipeOptions = {}
) {
  const { threshold = 50, preventDefault = false } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let startX = 0
    let startY = 0
    let startTime = 0

    const handlePointerDown = (e: PointerEvent) => {
      startX = e.clientX
      startY = e.clientY
      startTime = Date.now()

      if (preventDefault) {
        e.preventDefault()
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      const deltaTime = Date.now() - startTime

      // 忽略点击事件 (< 200ms 且移动距离小)
      if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        return
      }

      // 判断主要方向
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > threshold) {
          callbacks.onSwipeRight?.()
        } else if (deltaX < -threshold) {
          callbacks.onSwipeLeft?.()
        }
      } else {
        // 垂直滑动
        if (deltaY > threshold) {
          callbacks.onSwipeDown?.()
        } else if (deltaY < -threshold) {
          callbacks.onSwipeUp?.()
        }
      }

      if (preventDefault) {
        e.preventDefault()
      }
    }

    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointerup', handlePointerUp)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointerup', handlePointerUp)
    }
  }, [ref, callbacks, threshold, preventDefault])
}
