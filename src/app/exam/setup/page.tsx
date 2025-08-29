"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Settings, 
  PlayCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { ROUTES, EXAM_CONFIG } from '@/lib/constants'
import { Chapter, ExamSettings } from '@/types'

export default function ExamSetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Mock chapters data
  const mockChapters: Chapter[] = [
    {
      id: '1',
      title: 'Algebra',
      description: 'Linear equations, quadratic equations, polynomials',
      difficulty: 'easy',
      questionCount: 45,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Geometry',
      description: 'Shapes, angles, areas, and coordinate geometry',
      difficulty: 'medium',
      questionCount: 38,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Calculus',
      description: 'Derivatives, integrals, limits, and applications',
      difficulty: 'hard',
      questionCount: 52,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'Statistics',
      description: 'Probability, distributions, hypothesis testing',
      difficulty: 'medium',
      questionCount: 33,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      title: 'Trigonometry',
      description: 'Sine, cosine, tangent, and trigonometric identities',
      difficulty: 'medium',
      questionCount: 28,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const [examSettings, setExamSettings] = useState<ExamSettings>({
    selectedChapters: [],
    questionCount: EXAM_CONFIG.DEFAULT_QUESTIONS,
    timeLimit: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
    randomizeQuestions: true,
    showExplanations: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChapterSelection = (chapterId: string, checked: boolean) => {
    setExamSettings(prev => ({
      ...prev,
      selectedChapters: checked
        ? [...prev.selectedChapters, chapterId]
        : prev.selectedChapters.filter(id => id !== chapterId)
    }))
    if (errors.chapters) {
      setErrors(prev => ({ ...prev, chapters: '' }))
    }
  }

  const handleQuestionCountChange = (value: string) => {
    const count = parseInt(value) || EXAM_CONFIG.DEFAULT_QUESTIONS
    const maxQuestions = mockChapters
      .filter(chapter => examSettings.selectedChapters.includes(chapter.id))
      .reduce((sum, chapter) => sum + chapter.questionCount, 0)

    setExamSettings(prev => ({
      ...prev,
      questionCount: Math.min(count, maxQuestions, EXAM_CONFIG.MAX_QUESTIONS)
    }))
  }

  const handleTimeLimitChange = (value: string) => {
    const minutes = parseInt(value) || 60
    setExamSettings(prev => ({
      ...prev,
      timeLimit: minutes * 60 // Convert to seconds
    }))
  }

  const validateSettings = () => {
    const newErrors: Record<string, string> = {}

    if (examSettings.selectedChapters.length === 0) {
      newErrors.chapters = 'Please select at least one chapter'
    }

    if (examSettings.questionCount < EXAM_CONFIG.MIN_QUESTIONS) {
      newErrors.questions = `Minimum ${EXAM_CONFIG.MIN_QUESTIONS} questions required`
    }

    const maxQuestions = mockChapters
      .filter(chapter => examSettings.selectedChapters.includes(chapter.id))
      .reduce((sum, chapter) => sum + chapter.questionCount, 0)

    if (examSettings.questionCount > maxQuestions) {
      newErrors.questions = `Maximum ${maxQuestions} questions available for selected chapters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartExam = () => {
    if (!validateSettings()) return

    // Store exam settings and navigate to exam page
    localStorage.setItem('currentExamSettings', JSON.stringify(examSettings))
    router.push('/exam')
  }

  const selectedChapters = mockChapters.filter(chapter => 
    examSettings.selectedChapters.includes(chapter.id)
  )

  const maxAvailableQuestions = selectedChapters.reduce(
    (sum, chapter) => sum + chapter.questionCount, 
    0
  )

  const estimatedTime = Math.ceil(examSettings.questionCount * 1.5) // 1.5 minutes per question

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Setup Your Exam</h1>
          <p className="text-muted-foreground">
            Configure your exam preferences and select topics to test your knowledge.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Select Chapters
                </CardTitle>
                <CardDescription>
                  Choose the topics you want to be tested on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.chapters && (
                  <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-md flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {errors.chapters}
                  </div>
                )}
                
                <div className="grid gap-3">
                  {mockChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        examSettings.selectedChapters.includes(chapter.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={examSettings.selectedChapters.includes(chapter.id)}
                          onChange={(e) => handleChapterSelection(chapter.id, e.target.checked)}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{chapter.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                chapter.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                chapter.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {chapter.difficulty}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {chapter.questionCount} questions
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exam Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Exam Configuration
                </CardTitle>
                <CardDescription>
                  Customize your exam experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min={EXAM_CONFIG.MIN_QUESTIONS}
                      max={Math.min(maxAvailableQuestions, EXAM_CONFIG.MAX_QUESTIONS)}
                      value={examSettings.questionCount}
                      onChange={(e) => handleQuestionCountChange(e.target.value)}
                      placeholder="20"
                    />
                    {errors.questions && (
                      <p className="text-sm text-error">{errors.questions}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Max available: {maxAvailableQuestions} questions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min={15}
                      max={180}
                      value={examSettings.timeLimit ? examSettings.timeLimit / 60 : 60}
                      onChange={(e) => handleTimeLimitChange(e.target.value)}
                      placeholder="60"
                    />
                    <p className="text-xs text-muted-foreground">
                      Estimated: {estimatedTime} minutes
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={examSettings.randomizeQuestions}
                      onChange={(e) => setExamSettings(prev => ({
                        ...prev,
                        randomizeQuestions: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Randomize question order</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={examSettings.showExplanations}
                      onChange={(e) => setExamSettings(prev => ({
                        ...prev,
                        showExplanations: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Show explanations after answering</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Exam Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Chapters:</span>
                    <span className="font-medium">{examSettings.selectedChapters.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium">{examSettings.questionCount}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <span className="font-medium">{examSettings.timeLimit ? examSettings.timeLimit / 60 : 60} min</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span className="font-medium">{estimatedTime} min</span>
                  </div>
                </div>

                {selectedChapters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Chapters:</h4>
                    <div className="space-y-1">
                      {selectedChapters.map((chapter) => (
                        <div key={chapter.id} className="flex items-center text-xs">
                          <CheckCircle2 className="mr-2 h-3 w-3 text-green-500" />
                          <span>{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStartExam}
                  disabled={examSettings.selectedChapters.length === 0}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Exam
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📚 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Choose chapters you want to focus on</p>
                <p>• Start with fewer questions for practice</p>
                <p>• Enable explanations to learn from mistakes</p>
                <p>• Randomize questions for better learning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}