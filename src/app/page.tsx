"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { BookOpen, BarChart3, Trophy, Shield, Zap, Users } from 'lucide-react'
import { ROUTES, APP_CONFIG } from '@/lib/constants'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to continue your learning journey?
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href={ROUTES.DASHBOARD}>Go to Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={ROUTES.EXAM_SETUP}>Take Exam</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-20">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Modern SaaS MCQ Quiz Platform with Dark Mode, Analytics, and Gamification
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href={ROUTES.REGISTER}>Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={ROUTES.LOGIN}>Login</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Why Choose QuizMaster Pro?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online examinations with our modern, feature-rich platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Interactive Exams</CardTitle>
                <CardDescription>
                  Take MCQ exams with instant feedback, explanations, and progress tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Track your performance, identify weak areas, and monitor improvement over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Gamification</CardTitle>
                <CardDescription>
                  Earn badges, compete with peers, and unlock achievements as you learn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with reliable performance and data protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Fast & Modern</CardTitle>
                <CardDescription>
                  Lightning-fast performance with modern UI/UX and responsive design
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Comprehensive admin tools for managing questions, users, and analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-20 bg-muted rounded-lg">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students and educators who trust QuizMaster Pro for their examination needs
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href={ROUTES.REGISTER}>Create Free Account</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={ROUTES.LOGIN}>Sign In</Link>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
