"use client"

import React from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  className,
  showSidebar = true 
}: MainLayoutProps) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {isAuthenticated && showSidebar && <Sidebar />}
        <main className={cn(
          "flex-1 p-6",
          isAuthenticated && showSidebar && "ml-0",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}