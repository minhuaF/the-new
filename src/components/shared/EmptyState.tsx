import { ReactNode } from 'react'

interface EmptyStateProps {
  /** 图标 (emoji 或 lucide-react 组件) */
  icon: ReactNode
  /** 标题 */
  title: string
  /** 描述文字 */
  description: string
  /** 操作按钮 (可选) */
  action?: ReactNode
}

/**
 * 空状态组件
 * 用于展示无数据、无结果等状态
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center fade-in">
      {/* 图标 */}
      <div className="text-6xl sm:text-7xl mb-6 scale-in">{icon}</div>

      {/* 标题 */}
      <h2 className="text-xl sm:text-2xl font-serif font-light text-slate-800 mb-3 slide-up">
        {title}
      </h2>

      {/* 描述 */}
      <p className="text-slate-600 font-light text-base sm:text-lg max-w-md mb-8 slide-up">
        {description}
      </p>

      {/* 操作按钮 */}
      {action && <div className="slide-up">{action}</div>}
    </div>
  )
}
