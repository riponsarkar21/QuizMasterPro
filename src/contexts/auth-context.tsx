"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginFormData, RegisterFormData, ApiResponse } from '@/types'
import { useLocalStorage } from '@/hooks'
import { STORAGE_KEYS } from '@/lib/constants'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginFormData) => Promise<ApiResponse<User>>
  register: (data: RegisterFormData) => Promise<ApiResponse<User>>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useLocalStorage<string | null>(STORAGE_KEYS.AUTH_TOKEN, null)

  const isAuthenticated = !!user

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Mock token validation - check if it's a valid mock token
          const userData = JSON.parse(atob(token.split('.')[1] || '{}'))
          if (userData.id && userData.email) {
            setUser(userData)
          } else {
            setToken(null)
          }
        } catch (error) {
          console.error('Auth initialization failed:', error)
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [token, setToken])

  const login = async (data: LoginFormData): Promise<ApiResponse<User>> => {
    try {
      setIsLoading(true)
      
      // Mock authentication - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo accounts
      let mockUser: User
      
      if (data.email === 'student@demo.com' && data.password === 'demo123') {
        mockUser = {
          id: 'student-1',
          email: 'student@demo.com',
          name: 'Demo Student',
          role: 'student',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else if (data.email === 'admin@demo.com' && data.password === 'demo123') {
        mockUser = {
          id: 'admin-1',
          email: 'admin@demo.com',
          name: 'Demo Admin',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
      
      // Create mock JWT token
      const mockToken = 'mock.' + btoa(JSON.stringify(mockUser)) + '.signature'
      
      setToken(mockToken)
      setUser(mockUser)
      return { success: true, data: mockUser }
    } catch {
      return { success: false, error: 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterFormData): Promise<ApiResponse<User>> => {
    try {
      setIsLoading(true)
      
      // Mock registration - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if email already exists (mock validation)
      if (data.email === 'student@demo.com' || data.email === 'admin@demo.com') {
        return { success: false, error: 'Email already exists' }
      }
      
      // Create new user
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: data.email,
        name: data.name,
        role: 'student', // Default role for new registrations
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      // Create mock JWT token
      const mockToken = 'mock.' + btoa(JSON.stringify(newUser)) + '.signature'
      
      setToken(mockToken)
      setUser(newUser)
      return { success: true, data: newUser }
    } catch {
      return { success: false, error: 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    // Clear other user-related storage
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
    localStorage.removeItem(STORAGE_KEYS.EXAM_PROGRESS)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}