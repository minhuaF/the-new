import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4'
}

/**
 * 加载动画组件
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-slate-200 border-t-rose-400 animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="加载中"
    >
      <span className="sr-only">加载中...</span>
    </div>
  )
}

/**
 * 全屏加载组件
 */
export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 backdrop-blur-sm flex flex-col items-center justify-center z-50 fade-in">
      <LoadingSpinner size="xl" />
      {message && <p className="mt-6 text-slate-600 font-light text-lg">{message}</p>}
    </div>
  )
}
