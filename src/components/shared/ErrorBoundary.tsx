'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200 p-8 text-center">
        {/* 错误图标 */}
        <div className="text-6xl mb-6">⚠️</div>

        {/* 标题 */}
        <h2 className="text-2xl font-serif font-light text-slate-800 mb-4">出错了</h2>

        {/* 错误信息 */}
        <p className="text-slate-600 font-light mb-2">抱歉,页面遇到了一些问题:</p>
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl mb-6 font-mono font-light break-words">
          {error.message}
        </p>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default" className="bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-light transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            重试
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-300 hover:border-amber-400 hover:bg-amber-50 rounded-2xl font-light transition-all duration-300">
            刷新页面
          </Button>
        </div>
      </div>
    </div>
  )
}
