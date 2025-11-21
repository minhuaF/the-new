import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * 骨架屏组件
 * 用于加载状态的占位显示
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-slate-200/60 relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
        backgroundSize: '200px 100%',
        backgroundRepeat: 'no-repeat',
        animation: 'shimmer 2s infinite'
      }}
    />
  )
}
