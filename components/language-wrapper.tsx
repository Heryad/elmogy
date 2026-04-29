'use client'

import { useStore } from '@/lib/store-context'
import { ReactNode, useEffect, useState } from 'react'

export function LanguageWrapper({ children }: { children: ReactNode }) {
  const { language } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = language
  }, [language])

  if (!mounted) {
    return children
  }

  return children
}
