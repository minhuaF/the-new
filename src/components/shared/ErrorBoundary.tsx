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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* 错误图标 */}
        <div className="text-6xl mb-6">⚠️</div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">出错了</h2>

        {/* 错误信息 */}
        <p className="text-gray-600 mb-2">抱歉,页面遇到了一些问题:</p>
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6 font-mono break-words">
          {error.message}
        </p>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            重试
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            刷新页面
          </Button>
        </div>
      </div>
    </div>
  )
}
