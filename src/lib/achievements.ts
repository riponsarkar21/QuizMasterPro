import { Achievement, UserAchievement, UserStatistics } from '@/types'

export const ACHIEVEMENTS: Achievement[] = [
  // Performance Achievements
  {
    id: 'first_exam',
    title: 'First Steps',
    description: 'Complete your first exam',
    icon: '🎯',
    category: 'milestone',
    criteria: {
      type: 'exam_count',
      value: 1,
      condition: 'greater_than',
      timeframe: 'all_time'
    },
    reward: {
      type: 'badge',
      value: 'first_exam_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Score 100% in any exam',
    icon: '⭐',
    category: 'performance',
    criteria: {
      type: 'score_threshold',
      value: 100,
      condition: 'equal_to'
    },
    reward: {
      type: 'badge',
      value: 'perfect_score_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'high_achiever',
    title: 'High Achiever',
    description: 'Score above 90% in 5 exams',
    icon: '🏆',
    category: 'performance',
    criteria: {
      type: 'score_threshold',
      value: 90,
      condition: 'greater_than'
    },
    reward: {
      type: 'badge',
      value: 'high_achiever_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'accuracy_master',
    title: 'Accuracy Master',
    description: 'Maintain 95% accuracy over 10 exams',
    icon: '🎪',
    category: 'performance',
    criteria: {
      type: 'accuracy_threshold',
      value: 95,
      condition: 'greater_than'
    },
    reward: {
      type: 'badge',
      value: 'accuracy_master_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  
  // Participation Achievements
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Complete 10 exams',
    icon: '📚',
    category: 'participation',
    criteria: {
      type: 'exam_count',
      value: 10,
      condition: 'greater_than',
      timeframe: 'all_time'
    },
    reward: {
      type: 'badge',
      value: 'dedicated_learner_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'exam_marathon',
    title: 'Exam Marathon',
    description: 'Complete 50 exams',
    icon: '🏃‍♂️',
    category: 'participation',
    criteria: {
      type: 'exam_count',
      value: 50,
      condition: 'greater_than',
      timeframe: 'all_time'
    },
    reward: {
      type: 'badge',
      value: 'exam_marathon_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  
  // Streak Achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Complete exams for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak',
      value: 7,
      condition: 'greater_than',
      timeframe: 'daily'
    },
    reward: {
      type: 'badge',
      value: 'week_warrior_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Maintain a 30-day learning streak',
    icon: '⚡',
    category: 'streak',
    criteria: {
      type: 'streak',
      value: 30,
      condition: 'greater_than',
      timeframe: 'daily'
    },
    reward: {
      type: 'badge',
      value: 'unstoppable_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  
  // Special Achievements
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete an exam in under 5 minutes with 80%+ score',
    icon: '💨',
    category: 'special',
    criteria: {
      type: 'time_spent',
      value: 300, // 5 minutes in seconds
      condition: 'less_than'
    },
    reward: {
      type: 'badge',
      value: 'speed_demon_badge'
    },
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'chapter_master',
    title: 'Chapter Master',
    description: 'Complete all questions in a chapter with 90%+ accuracy',
    icon: '👑',
    category: 'milestone',
    criteria: {
      type: 'chapter_mastery',
      value: 90,
      condition: 'greater_than'
    },
    reward: {
      type: 'badge',
      value: 'chapter_master_badge'
    },
    isActive: true,
    createdAt: new Date()
  }
]

export function calculateAchievementProgress(
  achievement: Achievement,
  userStats: UserStatistics
): number {
  const { criteria } = achievement
  
  switch (criteria.type) {
    case 'exam_count':
      return Math.min((userStats.totalExamsAttempted / criteria.value) * 100, 100)
    
    case 'score_threshold':
      return userStats.bestScore >= criteria.value ? 100 : 0
    
    case 'accuracy_threshold':
      const accuracy = (userStats.totalCorrectAnswers / userStats.totalQuestionsAnswered) * 100
      return accuracy >= criteria.value ? 100 : 0
    
    case 'streak':
      return Math.min((userStats.currentStreak / criteria.value) * 100, 100)
    
    case 'time_spent':
      // This needs to be calculated per exam, not total time
      return 0 // Placeholder
    
    case 'chapter_mastery':
      // Check if any chapter has been mastered
      const masteredChapters = userStats.chapterStats.filter(
        chapter => chapter.accuracy >= criteria.value
      )
      return masteredChapters.length > 0 ? 100 : 0
    
    default:
      return 0
  }
}

export function checkAchievementUnlock(
  achievement: Achievement,
  userStats: UserStatistics
): boolean {
  return calculateAchievementProgress(achievement, userStats) === 100
}

export function getUnlockedAchievements(
  userStats: UserStatistics,
  currentAchievements: UserAchievement[] = []
): Achievement[] {
  const currentAchievementIds = new Set(
    currentAchievements.map(ua => ua.achievementId)
  )
  
  return ACHIEVEMENTS.filter(achievement => 
    !currentAchievementIds.has(achievement.id) &&
    checkAchievementUnlock(achievement, userStats)
  )
}

export function getMockUserAchievements(userId: string): UserAchievement[] {
  // Mock data for demonstration
  return [
    {
      id: '1',
      userId,
      achievementId: 'first_exam',
      achievement: ACHIEVEMENTS.find(a => a.id === 'first_exam')!,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      progress: 100,
      isCompleted: true
    },
    {
      id: '2',
      userId,
      achievementId: 'dedicated_learner',
      achievement: ACHIEVEMENTS.find(a => a.id === 'dedicated_learner')!,
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      progress: 100,
      isCompleted: true
    },
    {
      id: '3',
      userId,
      achievementId: 'high_achiever',
      achievement: ACHIEVEMENTS.find(a => a.id === 'high_achiever')!,
      unlockedAt: new Date(),
      progress: 60,
      isCompleted: false
    }
  ]
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category)
}

export function formatAchievementProgress(progress: number): string {
  return `${Math.round(progress)}%`
}