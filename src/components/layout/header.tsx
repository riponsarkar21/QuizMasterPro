"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import { Moon, Sun, User, LogOut, Menu, Trophy, BookOpen, ChevronDown, Settings } from 'lucide-react'
import { APP_CONFIG, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { actualTheme, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    logout()
    router.push(ROUTES.HOME)
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-1.5">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">{APP_CONFIG.name}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link
                href={ROUTES.DASHBOARD}
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href={ROUTES.EXAM_SETUP}
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Take Exam
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href={ROUTES.ADMIN}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={actualTheme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
            <Moon className="h-4 w-4" />
          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      href={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href={ROUTES.DASHBOARD}
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href={ROUTES.ADMIN}
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}