export const APP_CONFIG = {
  name: 'QuizMaster Pro',
  description: 'Modern SaaS MCQ Quiz Platform',
  version: '1.0.0',
  author: 'QuizMaster Team',
  url: 'https://quizmaster.pro'
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  EXAM: '/exam',
  EXAM_SETUP: '/exam/setup',
  EXAM_RESULTS: '/exam/results',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CHAPTERS: '/admin/chapters',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_ANALYTICS: '/admin/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  CHAPTERS: {
    LIST: '/api/chapters',
    CREATE: '/api/chapters',
    UPDATE: '/api/chapters',
    DELETE: '/api/chapters'
  },
  QUESTIONS: {
    LIST: '/api/questions',
    CREATE: '/api/questions',
    UPDATE: '/api/questions',
    DELETE: '/api/questions',
    BY_CHAPTER: '/api/questions/chapter'
  },
  EXAMS: {
    START: '/api/exams/start',
    SUBMIT: '/api/exams/submit',
    RESULTS: '/api/exams/results',
    HISTORY: '/api/exams/history'
  },
  REPORTS: {
    CREATE: '/api/reports',
    LIST: '/api/reports',
    UPDATE: '/api/reports'
  },
  ANALYTICS: {
    STUDENT: '/api/analytics/student',
    ADMIN: '/api/analytics/admin',
    CHAPTERS: '/api/analytics/chapters'
  }
} as const

export const EXAM_CONFIG = {
  DEFAULT_TIME_LIMIT: 3600, // 1 hour in seconds
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 100,
  DEFAULT_QUESTIONS: 20,
  AUTO_SUBMIT_WARNING: 300, // 5 minutes in seconds
  SAVE_INTERVAL: 30000 // 30 seconds
} as const

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false'
} as const

export const REPORT_REASONS = [
  { value: 'incorrect_answer', label: 'Incorrect Answer' },
  { value: 'unclear_question', label: 'Unclear Question' },
  { value: 'technical_issue', label: 'Technical Issue' },
  { value: 'other', label: 'Other' }
] as const

export const BADGE_CRITERIA = {
  FIRST_EXAM: { name: 'First Steps', description: 'Complete your first exam' },
  PERFECT_SCORE: { name: 'Perfectionist', description: 'Score 100% in an exam' },
  SPEED_DEMON: { name: 'Speed Demon', description: 'Complete an exam in under 30 minutes' },
  CONSISTENT: { name: 'Consistent Performer', description: 'Score above 80% in 5 consecutive exams' },
  EXPLORER: { name: 'Explorer', description: 'Attempt questions from 10 different chapters' },
  DEDICATED: { name: 'Dedicated Learner', description: 'Complete 50 exams' },
  EXPERT: { name: 'Subject Expert', description: 'Score above 90% in a difficult chapter' }
} as const

export const THEME_COLORS = {
  LIGHT: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  DARK: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#22d3ee',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa'
  }
} as const

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

export const STORAGE_KEYS = {
  THEME: 'quiz-platform-theme',
  AUTH_TOKEN: 'quiz-platform-auth-token',
  USER_PREFERENCES: 'quiz-platform-user-preferences',
  EXAM_PROGRESS: 'quiz-platform-exam-progress'
} as const

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  QUESTION_MIN_LENGTH: 10,
  QUESTION_MAX_LENGTH: 500,
  OPTION_MIN_LENGTH: 1,
  OPTION_MAX_LENGTH: 200,
  EXPLANATION_MAX_LENGTH: 1000,
  REPORT_DESCRIPTION_MAX_LENGTH: 500
} as const