"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Minus,
  BarChart3,
  RefreshCw,
  Home,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react'
import { formatTime, calculatePercentage, getGradeColor } from '@/lib/utils'
import { ExamSession, ExamResult } from '@/types'
import { ROUTES } from '@/lib/constants'

export default function ExamResultsPage() {
  const router = useRouter()
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [showDetailedReview, setShowDetailedReview] = useState(false)

  useEffect(() => {
    // Load exam results from localStorage
    const sessionData = localStorage.getItem('lastExamSession')
    if (!sessionData) {
      router.push(ROUTES.DASHBOARD)
      return
    }

    const session: ExamSession = JSON.parse(sessionData)
    setExamSession(session)

    // Calculate detailed results
    const correctAnswers = session.answers.filter((answer, index) => 
      answer === session.questions[index]?.correctAnswer
    ).length
    
    const wrongAnswers = session.answers.filter((answer, index) => 
      answer !== null && answer !== session.questions[index]?.correctAnswer
    ).length
    
    const skippedQuestions = session.answers.filter(answer => answer === null).length
    
    const result: ExamResult = {
      id: session.id,
      examSessionId: session.id,
      studentId: session.studentId,
      score: session.score || 0,
      totalQuestions: session.questions.length,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      accuracy: calculatePercentage(correctAnswers, session.questions.length),
      timeSpent: session.timeSpent,
      chapterWiseResults: [], // Would be calculated from actual chapter data
      createdAt: new Date(),
    }

    setExamResult(result)
  }, [router])

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { message: "Excellent! Outstanding performance! 🎉", color: "text-green-600" }
    if (score >= 80) return { message: "Great job! Well done! 👏", color: "text-blue-600" }
    if (score >= 70) return { message: "Good work! Keep it up! 👍", color: "text-yellow-600" }
    if (score >= 60) return { message: "Not bad! Room for improvement. 📚", color: "text-orange-600" }
    return { message: "Keep practicing! You'll get better! 💪", color: "text-red-600" }
  }

  const getBadgesEarned = (score: number, timeSpent: number) => {
    const badges = []
    if (score === 100) badges.push({ name: "Perfect Score", icon: "🏆" })
    if (score >= 90) badges.push({ name: "High Achiever", icon: "⭐" })
    if (timeSpent < 1800) badges.push({ name: "Speed Demon", icon: "⚡" }) // Less than 30 minutes
    if (score >= 80) badges.push({ name: "Good Performance", icon: "🎯" })
    return badges
  }

  if (!examSession || !examResult) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p>Loading results...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const scoreMessage = getScoreMessage(examResult.score)
  const badgesEarned = getBadgesEarned(examResult.score, examResult.timeSpent)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Exam Complete! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              Here are your results and performance breakdown
            </p>
          </div>
        </div>

        {/* Score Overview */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <div className={`text-6xl font-bold ${getGradeColor(examResult.score)}`}>
                {examResult.score}%
              </div>
            </div>
            <CardTitle className={`text-2xl ${scoreMessage.color}`}>
              {scoreMessage.message}
            </CardTitle>
            <CardDescription className="text-lg">
              You answered {examResult.correctAnswers} out of {examResult.totalQuestions} questions correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/50">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">{examResult.correctAnswers}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Correct</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/50">
                <XCircle className="mx-auto h-8 w-8 text-red-600 mb-2" />
                <div className="text-2xl font-bold text-red-600">{examResult.wrongAnswers}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Wrong</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-950/50">
                <Minus className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                <div className="text-2xl font-bold text-gray-600">{examResult.skippedQuestions}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Skipped</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">{formatTime(examResult.timeSpent)}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Time Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Accuracy Rate</span>
                  <span className="font-medium">{examResult.accuracy}%</span>
                </div>
                <Progress value={examResult.accuracy} className="h-3" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">
                    {calculatePercentage(examResult.totalQuestions - examResult.skippedQuestions, examResult.totalQuestions)}%
                  </span>
                </div>
                <Progress 
                  value={calculatePercentage(examResult.totalQuestions - examResult.skippedQuestions, examResult.totalQuestions)} 
                  className="h-3" 
                />
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average time per question:</span>
                  <span className="font-medium">{Math.round(examResult.timeSpent / examResult.totalQuestions)} seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total questions:</span>
                  <span className="font-medium">{examResult.totalQuestions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Achievements Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badgesEarned.length > 0 ? (
                <div className="space-y-3">
                  {badgesEarned.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">Just earned!</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No new achievements this time</p>
                  <p className="text-sm text-muted-foreground">Keep practicing to unlock more badges!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Review */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Question Review</CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowDetailedReview(!showDetailedReview)}
              >
                {showDetailedReview ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </CardHeader>
          {showDetailedReview && (
            <CardContent>
              <div className="space-y-4">
                {examSession.questions.map((question, index) => {
                  const userAnswer = examSession.answers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  const isSkipped = userAnswer === null

                  return (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium">Question {index + 1}</span>
                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            {!isCorrect && !isSkipped && <XCircle className="h-4 w-4 text-red-600" />}
                            {isSkipped && <Minus className="h-4 w-4 text-gray-600" />}
                          </div>
                          <p className="text-sm mb-3">{question.question}</p>
                          
                          <div className="space-y-1">
                            {question.options.map((option, optionIndex) => {
                              const isUserAnswer = userAnswer === optionIndex
                              const isCorrectAnswer = optionIndex === question.correctAnswer
                              
                              let className = "text-sm p-2 rounded border"
                              if (isCorrectAnswer) {
                                className += " bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                              } else if (isUserAnswer && !isCorrectAnswer) {
                                className += " bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                              } else {
                                className += " bg-muted/50"
                              }

                              return (
                                <div key={optionIndex} className={className}>
                                  <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                                  {option}
                                  {isCorrectAnswer && <span className="ml-2 text-green-600">✓</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-red-600">✗</span>}
                                </div>
                              )
                            })}
                          </div>

                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded border-l-4 border-blue-400">
                              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Explanation:</h5>
                              <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={ROUTES.EXAM_SETUP}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Take Another Exam
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href={ROUTES.DASHBOARD}>
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/exam/results">
              <BarChart3 className="mr-2 h-4 w-4" />
              View All Results
            </Link>
          </Button>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examResult.score < 70 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 Consider reviewing the fundamentals and practicing more questions in weaker areas.
                  </p>
                </div>
              )}
              
              {examResult.skippedQuestions > 2 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ⏰ Try to manage your time better to answer all questions. Consider practicing with time limits.
                  </p>
                </div>
              )}
              
              {examResult.score >= 80 && (
                <div className="p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    🎯 Great job! Try taking harder difficulty levels or exploring advanced topics.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}