"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTimer } from '@/hooks'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react'
import { ReportQuestionModal, ReportSuccessNotification } from '@/components/exam/report-question-modal'
import { formatTime, shuffleArray, generateId } from '@/lib/utils'
import { Question, ExamSettings, ExamSession, ReportFormData } from '@/types'
import { ROUTES } from '@/lib/constants'

export default function ExamPage() {
  const router = useRouter()
  
  // Mock questions data - memoized to prevent recreation on every render
  const mockQuestions: Question[] = useMemo(() => [
    {
      id: '1',
      chapterId: '1',
      question: 'What is the solution to the equation 2x + 5 = 13?',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 1,
      explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
      difficulty: 'easy',
      tags: ['algebra', 'linear-equations'],
      isActive: true,
      reportCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      chapterId: '2',
      question: 'What is the area of a circle with radius 5 units?',
      options: ['25π square units', '10π square units', '25 square units', '50π square units'],
      correctAnswer: 0,
      explanation: 'Area of circle = πr². With r = 5, Area = π × 5² = 25π square units',
      difficulty: 'medium',
      tags: ['geometry', 'circles'],
      isActive: true,
      reportCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      chapterId: '3',
      question: 'What is the derivative of f(x) = x³ + 2x²?',
      options: ['3x² + 4x', '3x² + 2x', 'x² + 4x', '3x + 4'],
      correctAnswer: 0,
      explanation: 'Using power rule: d/dx(x³) = 3x² and d/dx(2x²) = 4x, so f\'(x) = 3x² + 4x',
      difficulty: 'hard',
      tags: ['calculus', 'derivatives'],
      isActive: true,
      reportCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], []) // Empty dependency array since this is static mock data

  const [examSettings, setExamSettings] = useState<ExamSettings | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showReportSuccess, setShowReportSuccess] = useState(false)

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())

  const { time, start } = useTimer(3600) // Default 1 hour

  useEffect(() => {
    // Load exam settings from localStorage
    const settings = localStorage.getItem('currentExamSettings')
    if (!settings) {
      router.push(ROUTES.EXAM_SETUP)
      return
    }

    const parsedSettings: ExamSettings = JSON.parse(settings)
    setExamSettings(parsedSettings)

    // Simulate loading questions based on settings
    let examQuestions = [...mockQuestions].slice(0, parsedSettings.questionCount)
    
    if (parsedSettings.randomizeQuestions) {
      examQuestions = shuffleArray(examQuestions)
    }

    setQuestions(examQuestions)
    setAnswers(new Array(examQuestions.length).fill(null))
    
    // Start timer
    start()
  }, [router, start, mockQuestions])

  useEffect(() => {
    // Check if current question is answered
    const currentAnswer = answers[currentQuestionIndex]
    setIsAnswered(currentAnswer !== null)
    setSelectedAnswer(currentAnswer)
    setShowExplanation(false)
  }, [currentQuestionIndex, answers])

  const handleSubmitExam = React.useCallback(() => {
    
    // Calculate results
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length
    
    const examSession: ExamSession = {
      id: generateId(),
      studentId: 'current-user-id',
      chapterIds: examSettings?.selectedChapters || [],
      questions,
      answers,
      startTime: new Date(Date.now() - ((examSettings?.timeLimit || 3600) - time) * 1000),
      endTime: new Date(),
      duration: (examSettings?.timeLimit || 3600) - time,
      isCompleted: true,
      score: Math.round((correctAnswers / questions.length) * 100),
      timeSpent: (examSettings?.timeLimit || 3600) - time,
    }

    // Store results and navigate
    localStorage.setItem('lastExamSession', JSON.stringify(examSession))
    localStorage.removeItem('currentExamSettings')
    router.push('/exam/results')
  }, [answers, questions, examSettings, time, router])

  useEffect(() => {
    // Auto-submit when timer reaches 0
    if (time === 0) {
      handleSubmitExam()
    }
  }, [time, handleSubmitExam])

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered && !examSettings?.showExplanations) return

    setSelectedAnswer(optionIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = optionIndex
    setAnswers(newAnswers)
    setIsAnswered(true)

    if (examSettings?.showExplanations) {
      setShowExplanation(true)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleFlagQuestion = () => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex)
    } else {
      newFlagged.add(currentQuestionIndex)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleSubmitReport = async (reportData: ReportFormData) => {
    // Here you would normally send the report to your API
    console.log('Report submitted:', {
      questionId: currentQuestion?.id,
      ...reportData,
      studentId: 'current-user-id',
      timestamp: new Date().toISOString()
    })
    
    setShowReportSuccess(true)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = answers.filter(answer => answer !== null).length
  const timeWarning = time <= 300 // 5 minutes remaining

  if (!examSettings || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Mathematics Exam</h1>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${timeWarning ? 'text-error' : ''}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">
                {formatTime(time)}
              </span>
            </div>
            
            <Button variant="outline" onClick={() => setShowSubmitDialog(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFlagQuestion}
                      className={flaggedQuestions.has(currentQuestionIndex) ? 'text-yellow-600' : ''}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQuestion?.question}
                </div>

                <div className="space-y-3">
                  {currentQuestion?.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentQuestion.correctAnswer
                    const showResult = isAnswered && examSettings.showExplanations
                    
                    let buttonVariant: "outline" | "default" | "secondary" = "outline"
                    let buttonClass = ""
                    
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass = "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                      } else if (isSelected && !isCorrect) {
                        buttonClass = "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                      }
                    } else if (isSelected) {
                      buttonVariant = "secondary"
                    }

                    return (
                      <Button
                        key={index}
                        variant={buttonVariant}
                        className={`w-full justify-start text-left h-auto p-4 ${buttonClass}`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isAnswered && examSettings.showExplanations}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showExplanation && currentQuestion?.explanation && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {flaggedQuestions.has(currentQuestionIndex) && (
                  <span className="text-yellow-600">🚩 Flagged</span>
                )}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const isAnswered = answers[index] !== null
                    const isCurrent = index === currentQuestionIndex
                    const isFlagged = flaggedQuestions.has(index)
                    
                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={`relative h-10 ${
                          isAnswered ? 'bg-green-100 dark:bg-green-900 border-green-300' : ''
                        } ${isFlagged ? 'ring-2 ring-yellow-400' : ''}`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600" />
                        )}
                      </Button>
                    )
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900 border border-green-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border rounded"></div>
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-3 w-3 text-yellow-600" />
                    <span>Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Exam Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{answeredCount}/{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flagged:</span>
                  <span>{flaggedQuestions.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time left:</span>
                  <span className={timeWarning ? 'text-error font-medium' : ''}>
                    {formatTime(time)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {currentQuestion && (
        <ReportQuestionModal
          question={currentQuestion}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
        />
      )}

      {/* Report Success Notification */}
      <ReportSuccessNotification
        isVisible={showReportSuccess}
        onHide={() => setShowReportSuccess(false)}
      />

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? You have answered {answeredCount} out of {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          
          {answeredCount < questions.length && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    You have {questions.length - answeredCount} unanswered questions
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    These will be marked as incorrect if you submit now.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Exam
            </Button>
            <Button onClick={handleSubmitExam}>
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}