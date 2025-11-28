'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAuthToken } from '@/lib/api'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect on login page
    if (pathname === '/admin') return
    
    if (!getAuthToken()) {
      router.push('/admin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <>{children}</>
}

