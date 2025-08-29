export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: 'student'
  totalExamsAttempted: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  averageScore: number
  badges: Badge[]
  rank: number
}

export interface Admin extends User {
  role: 'admin'
  permissions: Permission[]
}

export interface Chapter {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  chapterId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  isActive: boolean
  reportCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ExamSession {
  id: string
  studentId: string
  chapterIds: string[]
  questions: Question[]
  answers: (number | null)[]
  startTime: Date
  endTime?: Date
  duration: number // in seconds
  isCompleted: boolean
  score?: number
  timeSpent: number
}

export interface ExamResult {
  id: string
  examSessionId: string
  studentId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  skippedQuestions: number
  accuracy: number
  timeSpent: number
  chapterWiseResults: ChapterResult[]
  createdAt: Date
}

export interface ChapterResult {
  chapterId: string
  chapterTitle: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
}

export interface Report {
  id: string
  questionId: string
  studentId: string
  reason: 'incorrect_answer' | 'unclear_question' | 'technical_issue' | 'other'
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  adminResponse?: string
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  criteria: string
  unlockedAt: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'performance' | 'participation' | 'streak' | 'milestone' | 'special'
  criteria: AchievementCriteria
  reward: AchievementReward
  isActive: boolean
  createdAt: Date
}

export interface AchievementCriteria {
  type: 'exam_count' | 'score_threshold' | 'accuracy_threshold' | 'streak' | 'time_spent' | 'chapter_mastery'
  value: number
  condition: 'greater_than' | 'equal_to' | 'less_than'
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time'
}

export interface AchievementReward {
  type: 'badge' | 'points' | 'title'
  value: string | number
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  achievement: Achievement
  unlockedAt: Date
  progress: number // 0-100 percentage
  isCompleted: boolean
}

export interface UserProfile {
  id: string
  userId: string
  bio?: string
  avatar?: string
  preferences: UserPreferences
  statistics: UserStatistics
  achievements: UserAchievement[]
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationSettings
  examSettings: DefaultExamSettings
}

export interface DefaultExamSettings {
  preferredQuestionCount: number
  preferredTimeLimit: number
  showExplanations: boolean
  randomizeQuestions: boolean
}

export interface UserStatistics {
  totalExamsAttempted: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  averageScore: number
  bestScore: number
  currentStreak: number
  longestStreak: number
  totalTimeSpent: number // in minutes
  chapterStats: ChapterStats[]
  recentActivity: UserActivity[]
}

export interface ChapterStats {
  chapterId: string
  chapterTitle: string
  attemptsCount: number
  averageScore: number
  accuracy: number
  timeSpent: number
  lastAttempted: Date
  isCompleted: boolean
}

export interface UserActivity {
  id: string
  type: 'exam_completed' | 'achievement_unlocked' | 'streak_milestone' | 'badge_earned'
  description: string
  metadata?: Record<string, any>
  timestamp: Date
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface Analytics {
  totalStudents: number
  totalQuestions: number
  totalExams: number
  averageScore: number
  mostAttemptedChapters: ChapterAnalytics[]
  questionDifficultyDistribution: DifficultyDistribution
  recentActivity: Activity[]
}

export interface ChapterAnalytics {
  chapter: Chapter
  attemptCount: number
  averageScore: number
  accuracy: number
}

export interface DifficultyDistribution {
  easy: number
  medium: number
  hard: number
}

export interface Activity {
  id: string
  type: 'exam_completed' | 'question_reported' | 'user_registered'
  description: string
  timestamp: Date
  userId?: string
}

export interface ExamSettings {
  selectedChapters: string[]
  questionCount: number
  timeLimit?: number
  randomizeQuestions: boolean
  showExplanations: boolean
}

export interface Theme {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  examReminders: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ReportFormData {
  reason: Report['reason']
  description: string
}

export interface QuestionFormData {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: Question['difficulty']
  tags: string[]
  chapterId: string
}

export interface ChapterFormData {
  title: string
  description: string
  difficulty: Chapter['difficulty']
}