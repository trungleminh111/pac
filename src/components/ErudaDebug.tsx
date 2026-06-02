// components/ErudaDebug.tsx
'use client'

import { useEffect } from 'react'

export default function ErudaDebug() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    document.body.appendChild(script)
    script.onload = () => (window as any).eruda.init()
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}