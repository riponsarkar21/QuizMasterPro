"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Trophy,
  FileText,
  Users,
  MessageSquare,
  PieChart
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()

  if (!isAuthenticated) {
    return null
  }

  const studentNavItems = [
    {
      title: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: Home,
    },
    {
      title: 'Take Exam',
      href: ROUTES.EXAM_SETUP,
      icon: BookOpen,
    },
    {
      title: 'Results',
      href: ROUTES.EXAM_RESULTS,
      icon: BarChart3,
    },
    {
      title: 'Achievements',
      href: ROUTES.PROFILE + '?tab=achievements',
      icon: Trophy,
    },
    {
      title: 'Profile',
      href: ROUTES.PROFILE,
      icon: Settings,
    },
  ]

  const adminNavItems = [
    {
      title: 'Dashboard',
      href: ROUTES.ADMIN_DASHBOARD,
      icon: Home,
    },
    {
      title: 'Chapters',
      href: ROUTES.ADMIN_CHAPTERS,
      icon: BookOpen,
    },
    {
      title: 'Questions',
      href: ROUTES.ADMIN_QUESTIONS,
      icon: FileText,
    },
    {
      title: 'Reports',
      href: ROUTES.ADMIN_REPORTS,
      icon: MessageSquare,
    },
    {
      title: 'Analytics',
      href: ROUTES.ADMIN_ANALYTICS,
      icon: PieChart,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
  ]

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems

  return (
    <aside className={cn("w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {user?.role === 'admin' ? 'Admin Panel' : 'Student Portal'}
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-muted font-medium"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>

        {user?.role === 'student' && (
          <div className="px-3">
            <Card className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Quick Stats</h3>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Exams Taken:</span>
                    <span>{(user as any).totalExamsAttempted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span>{Math.round((user as any).averageScore || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span>#{(user as any).rank || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </aside>
  )
}