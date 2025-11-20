'use client'

import { useEffect, useState, RefObject } from 'react'

export interface IntersectionOptions {
  /** 根元素 */
  root?: Element | null
  /** 根边距 */
  rootMargin?: string
  /** 阈值 (0-1) */
  threshold?: number | number[]
  /** 是否只触发一次 */
  triggerOnce?: boolean
}

/**
 * Intersection Observer Hook
 * 用于懒加载、无限滚动等场景
 * @param ref - 目标元素 ref
 * @param options - 配置选项
 * @returns { inView, entry } - 是否在视口内 + IntersectionObserverEntry
 */
export function useIntersection(
  ref: RefObject<Element>,
  options: IntersectionOptions = {}
) {
  const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options

  const [inView, setInView] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 已触发且设置了 triggerOnce
    if (triggerOnce && inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        setEntry(entry)
      },
      {
        root,
        rootMargin,
        threshold
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [ref, root, rootMargin, threshold, triggerOnce, inView])

  return { inView, entry }
}
