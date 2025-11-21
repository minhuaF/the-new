'use client'

import { useCallback } from 'react'

/**
 * 触觉反馈 Hook (Vibration API)
 * 注意: 仅在支持的设备上生效 (主要是移动设备)
 */
export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  return {
    /** 轻触反馈 (10ms) */
    light: useCallback(() => vibrate(10), [vibrate]),

    /** 中等反馈 (20ms) */
    medium: useCallback(() => vibrate(20), [vibrate]),

    /** 重度反馈 (30ms) */
    heavy: useCallback(() => vibrate(30), [vibrate]),

    /** 成功反馈 (短-长-短) */
    success: useCallback(() => vibrate([10, 50, 10]), [vibrate]),

    /** 错误反馈 (长-短-长-短-长) */
    error: useCallback(() => vibrate([20, 100, 20, 100, 20]), [vibrate]),

    /** 警告反馈 (中等-中等) */
    warning: useCallback(() => vibrate([20, 50, 20]), [vibrate]),

    /** 自定义模式 */
    custom: vibrate
  }
}
