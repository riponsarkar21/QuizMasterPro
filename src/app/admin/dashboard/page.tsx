"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Eye
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  // Mock data for admin dashboard
  const dashboardStats = {
    totalStudents: 1247,
    totalQuestions: 892,
    totalChapters: 15,
    pendingReportsCount: 23,
    recentActivity: [
      { id: 1, type: 'student_registered', description: 'New student registered: John Doe', timestamp: new Date('2025-01-20T10:30:00') },
      { id: 2, type: 'question_reported', description: 'Question #142 reported by Alice Smith', timestamp: new Date('2025-01-20T09:15:00') },
      { id: 3, type: 'exam_completed', description: 'Exam completed by 15 students in Mathematics', timestamp: new Date('2025-01-20T08:45:00') },
      { id: 4, type: 'chapter_added', description: 'New chapter "Advanced Calculus" added', timestamp: new Date('2025-01-19T16:20:00') },
    ],
    topPerformingChapters: [
      { name: 'Algebra', averageScore: 89, totalAttempts: 234 },
      { name: 'Geometry', averageScore: 85, totalAttempts: 189 },
      { name: 'Statistics', averageScore: 82, totalAttempts: 167 },
    ],
    pendingReports: [
      { id: 1, questionId: '142', reason: 'incorrect_answer', studentName: 'Alice Smith', timestamp: new Date('2025-01-20T09:15:00') },
      { id: 2, questionId: '89', reason: 'unclear_question', studentName: 'Bob Johnson', timestamp: new Date('2025-01-19T14:30:00') },
      { id: 3, questionId: '203', reason: 'technical_issue', studentName: 'Carol Davis', timestamp: new Date('2025-01-19T11:45:00') },
    ]
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student_registered':
        return <Users className="h-4 w-4 text-green-600" />
      case 'question_reported':
        return <MessageSquare className="h-4 w-4 text-yellow-600" />
      case 'exam_completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case 'chapter_added':
        return <BookOpen className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your quiz platform and monitor performance
            </p>
          </div>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href={ROUTES.ADMIN_QUESTIONS}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.ADMIN_CHAPTERS}>
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Chapters
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                +8 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalChapters}</div>
              <p className="text-xs text-muted-foreground">
                Across all subjects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingReportsCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and actions on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/admin/activity">View All Activity</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Top Performing Chapters */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Chapters</CardTitle>
              <CardDescription>
                Chapters with highest student performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.topPerformingChapters.map((chapter, index) => (
                <div key={index} className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{chapter.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {chapter.totalAttempts} attempts
                    </p>
                  </div>
                  <Badge variant={chapter.averageScore >= 85 ? 'success' : 'secondary'}>
                    {chapter.averageScore}% avg
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={ROUTES.ADMIN_ANALYTICS}>View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Pending Reports
                </CardTitle>
                <CardDescription>
                  Question reports that need your attention
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href={ROUTES.ADMIN_REPORTS}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.pendingReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">
                        Question #{report.questionId} reported
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {report.studentName} • {formatDate(report.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {report.reason.replace('_', ' ')}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/reports/${report.id}`}>Review</Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              {dashboardStats.pendingReports.length === 0 && (
                <div className="text-center py-6">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No pending reports</p>
                  <p className="text-sm text-muted-foreground">All reports have been reviewed</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href={ROUTES.ADMIN_QUESTIONS}>
                  <Plus className="h-5 w-5 mb-2" />
                  Add Question
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href={ROUTES.ADMIN_CHAPTERS}>
                  <BookOpen className="h-5 w-5 mb-2" />
                  Manage Chapters
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href={ROUTES.ADMIN_REPORTS}>
                  <MessageSquare className="h-5 w-5 mb-2" />
                  Review Reports
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href={ROUTES.ADMIN_ANALYTICS}>
                  <TrendingUp className="h-5 w-5 mb-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}