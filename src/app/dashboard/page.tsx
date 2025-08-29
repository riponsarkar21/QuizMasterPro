"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Target,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { calculatePercentage, getGradeColor } from '@/lib/utils'
import { ACHIEVEMENTS, getMockUserAchievements } from '@/lib/achievements'

export default function DashboardPage() {
  const { user } = useAuth()

  // Get user achievements
  const userAchievements = user ? getMockUserAchievements(user.id) : []
  const recentAchievements = ACHIEVEMENTS.slice(0, 3) // Show first 3 achievements

  // Mock data for demo
  const mockStats = {
    totalExams: 12,
    averageScore: 85,
    totalQuestions: 240,
    correctAnswers: 204,
    timeSpent: 720, // minutes
    rank: 15,
    recentExams: [
      { id: 1, chapter: 'Mathematics', score: 92, date: '2025-01-20', questions: 20 },
      { id: 2, chapter: 'Physics', score: 78, date: '2025-01-18', questions: 25 },
      { id: 3, chapter: 'Chemistry', score: 88, date: '2025-01-15', questions: 30 },
    ],
    weakAreas: [
      { chapter: 'Organic Chemistry', accuracy: 65 },
      { chapter: 'Calculus', accuracy: 72 },
      { chapter: 'Quantum Physics', accuracy: 68 },
    ]
  }

  const accuracy = calculatePercentage(mockStats.correctAnswers, mockStats.totalQuestions)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your learning progress and performance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href={ROUTES.EXAM_SETUP}>
              <BookOpen className="mr-2 h-4 w-4" />
              Take New Exam
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={ROUTES.EXAM_RESULTS}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Results
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalExams}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(mockStats.averageScore)}`}>
                {mockStats.averageScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(accuracy)}`}>
                {accuracy}%
              </div>
              <p className="text-xs text-muted-foreground">
                {mockStats.correctAnswers}/{mockStats.totalQuestions} correct
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{mockStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                Top 5% globally
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Recent Exams
              </CardTitle>
              <CardDescription>
                Your latest exam performances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStats.recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{exam.chapter}</p>
                    <p className="text-xs text-muted-foreground">
                      {exam.questions} questions • {exam.date}
                    </p>
                  </div>
                  <Badge variant={exam.score >= 80 ? 'success' : exam.score >= 70 ? 'warning' : 'destructive'}>
                    {exam.score}%
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href={ROUTES.EXAM_RESULTS}>View All Results</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Areas to Improve
              </CardTitle>
              <CardDescription>
                Focus on these topics to boost your performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStats.weakAreas.map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{area.chapter}</p>
                    <span className="text-sm text-muted-foreground">{area.accuracy}%</span>
                  </div>
                  <Progress value={area.accuracy} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href={ROUTES.EXAM_SETUP}>Practice These Topics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  Your latest unlocked achievements
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.PROFILE + '?tab=achievements'}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {recentAchievements.map((achievement) => {
                const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id)
                const isUnlocked = userAchievement?.isCompleted || false
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${isUnlocked
                        ? 'bg-primary/5 border-primary/20 shadow-sm'
                        : 'bg-muted/50 border-muted opacity-60'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full text-lg ${isUnlocked ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {achievement.description}
                        </p>
                        {isUnlocked && userAchievement && (
                          <p className="text-xs text-primary font-medium mt-1">
                            Unlocked {userAchievement.unlockedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}