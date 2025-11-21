'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Upload, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

const navItems = [
  {
    href: '/',
    label: '首页',
    icon: Home
  },
  {
    href: '/articles',
    label: '文章',
    icon: BookOpen
  },
  {
    href: '/upload',
    label: '上传',
    icon: Upload
  },
  {
    href: '/settings',
    label: '设置',
    icon: Settings
  }
]

/**
 * 移动端底部导航栏
 * 仅在移动端显示 (< 768px)
 */
export function MobileNav() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // 仅移动端显示
  if (!isMobile) return null

  // 检查是否在文章详情页 (隐藏导航栏以获得更多阅读空间)
  const isArticleDetail = pathname.startsWith('/articles/') && pathname !== '/articles'
  if (isArticleDetail) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 safe-area-inset-bottom slide-up"
      role="navigation"
      aria-label="移动端主导航"
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 touch-target transition-colors relative',
                isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* 图标 */}
              <Icon className="w-5 h-5" />

              {/* 标签 */}
              <span className="text-xs font-medium">{label}</span>

              {/* 活动指示器 */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-600 rounded-t-full scale-in"
                  aria-hidden="true"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
