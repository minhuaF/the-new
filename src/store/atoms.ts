import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// ========== 用户偏好设置 (localStorage 持久化) ==========

/**
 * 阅读字体大小 (px)
 * 范围: 14-24px, 默认 18px
 */
export const fontSizeAtom = atomWithStorage('fontSize', 18)

/**
 * 阅读行高
 * 选项: 1.5 (紧凑), 1.8 (舒适), 2.0 (宽松)
 */
export const lineHeightAtom = atomWithStorage<1.5 | 1.8 | 2.0>('lineHeight', 1.8)

/**
 * 阅读模式开关
 * true: 浅米色背景,减少蓝光
 * false: 默认白色背景
 */
export const readingModeAtom = atomWithStorage('readingMode', false)

/**
 * 专注模式开关
 * true: 隐藏侧边栏和其他干扰元素
 * false: 显示完整界面
 */
export const focusModeAtom = atomWithStorage('focusMode', false)

// ========== 阅读状态 (会话级,不持久化) ==========

/**
 * 当前阅读的文章 ID
 */
export const currentArticleIdAtom = atom<string | null>(null)

/**
 * 阅读进度 (0-100)
 * 用于顶部进度条显示
 */
export const scrollProgressAtom = atom(0)

/**
 * Header 可见性
 * 向下滚动时隐藏,向上滚动时显示
 */
export const headerVisibleAtom = atom(true)

// ========== 派生状态 ==========

/**
 * 字体尺寸对应的 CSS 变量名
 */
export const fontSizeClassAtom = atom((get) => {
  const size = get(fontSizeAtom)
  if (size <= 16) return 'text-reading-sm'
  if (size <= 18) return 'text-reading-base'
  if (size <= 20) return 'text-reading-lg'
  return 'text-reading-xl'
})

/**
 * 行高对应的样式对象
 */
export const lineHeightStyleAtom = atom((get) => ({
  lineHeight: get(lineHeightAtom)
}))
