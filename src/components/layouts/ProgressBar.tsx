'use client'

interface ProgressBarProps {
  /** 进度百分比 (0-100) */
  progress: number
  /** 是否显示 */
  visible?: boolean
}

/**
 * 阅读进度条
 * 固定在页面顶部,显示当前阅读进度
 */
export function ProgressBar({ progress, visible = true }: ProgressBarProps) {
  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-purple-600 transition-all duration-150"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
