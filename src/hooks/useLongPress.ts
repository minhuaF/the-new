'use client'

import { useCallback, useRef, MouseEvent, TouchEvent } from 'react'

export interface LongPressOptions {
  /** 触发长按的延迟时间 (ms) */
  delay?: number
  /** 是否在移动后取消 */
  cancelOnMove?: boolean
  /** 移动距离阈值 (px) */
  moveThreshold?: number
}

export interface LongPressHandlers {
  onMouseDown: (e: MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: (e: TouchEvent) => void
  onTouchEnd: () => void
  onTouchMove: (e: TouchEvent) => void
}

/**
 * 长按手势 Hook
 * @param callback - 长按触发的回调函数
 * @param options - 配置选项
 * @returns 事件处理函数对象
 */
export function useLongPress(
  callback: (event: MouseEvent | TouchEvent) => void,
  options: LongPressOptions = {}
): LongPressHandlers {
  const { delay = 500, cancelOnMove = true, moveThreshold = 10 } = options

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const startPos = useRef<{ x: number; y: number } | undefined>(undefined)
  const eventRef = useRef<MouseEvent | TouchEvent | undefined>(undefined)

  const start = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // 保存事件和起始位置
      eventRef.current = event

      if ('touches' in event) {
        startPos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
      } else {
        startPos.current = {
          x: event.clientX,
          y: event.clientY
        }
      }

      // 设置定时器
      timeout.current = setTimeout(() => {
        callback(event)
      }, delay)
    },
    [callback, delay]
  )

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }
    startPos.current = undefined
    eventRef.current = undefined
  }, [])

  const move = useCallback(
    (event: TouchEvent) => {
      if (!cancelOnMove || !startPos.current) return

      const touch = event.touches[0]
      const deltaX = touch.clientX - startPos.current.x
      const deltaY = touch.clientY - startPos.current.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // 移动超过阈值则取消
      if (distance > moveThreshold) {
        clear()
      }
    },
    [cancelOnMove, moveThreshold, clear]
  )

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: move
  }
}
