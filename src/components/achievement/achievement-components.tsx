"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Achievement, UserAchievement } from '@/types'
import { formatAchievementProgress } from '@/lib/achievements'
import { Clock, Trophy, Star, Target } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  userAchievement?: UserAchievement
  progress?: number
  showProgress?: boolean
}

export function AchievementCard({ 
  achievement, 
  userAchievement, 
  progress = 0, 
  showProgress = true 
}: AchievementCardProps) {
  const isUnlocked = userAchievement?.isCompleted || false
  const currentProgress = userAchievement?.progress || progress

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'performance':
        return <Star className="h-4 w-4" />
      case 'participation':
        return <Target className="h-4 w-4" />
      case 'streak':
        return <Clock className="h-4 w-4" />
      case 'milestone':
        return <Trophy className="h-4 w-4" />
      case 'special':
        return <Trophy className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'performance':
        return 'bg-blue-500'
      case 'participation':
        return 'bg-green-500'
      case 'streak':
        return 'bg-orange-500'
      case 'milestone':
        return 'bg-purple-500'
      case 'special':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${
      isUnlocked ? 'ring-2 ring-primary/20' : 'opacity-80'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getCategoryColor(achievement.category)} text-white`}>
              {getCategoryIcon(achievement.category)}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>{achievement.title}</span>
                <span className="text-2xl">{achievement.icon}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {achievement.description}
              </CardDescription>
            </div>
          </div>
          
          {isUnlocked && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Unlocked
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize text-muted-foreground">
              {achievement.category.replace('_', ' ')}
            </span>
            {userAchievement?.unlockedAt && (
              <span className="text-muted-foreground">
                {userAchievement.unlockedAt.toLocaleDateString()}
              </span>
            )}
          </div>

          {showProgress && !isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {formatAchievementProgress(currentProgress)}
                </span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>
          )}

          {achievement.reward.type === 'badge' && (
            <div className="text-xs text-muted-foreground">
              Reward: Badge
            </div>
          )}
        </div>
      </CardContent>

      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </Card>
  )
}

interface AchievementGridProps {
  achievements: Achievement[]
  userAchievements?: UserAchievement[]
  showProgress?: boolean
  filter?: Achievement['category'] | 'all'
}

export function AchievementGrid({ 
  achievements, 
  userAchievements = [], 
  showProgress = true,
  filter = 'all'
}: AchievementGridProps) {
  const userAchievementMap = new Map(
    userAchievements.map(ua => [ua.achievementId, ua])
  )

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAchievements.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          userAchievement={userAchievementMap.get(achievement.id)}
          showProgress={showProgress}
        />
      ))}
    </div>
  )
}

interface AchievementStatsProps {
  userAchievements: UserAchievement[]
  totalAchievements: number
}

export function AchievementStats({ userAchievements, totalAchievements }: AchievementStatsProps) {
  const unlockedCount = userAchievements.filter(ua => ua.isCompleted).length
  const inProgressCount = userAchievements.filter(ua => !ua.isCompleted && ua.progress > 0).length
  const completionRate = (unlockedCount / totalAchievements) * 100

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
          <div className="text-sm text-muted-foreground">Unlocked</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{totalAchievements - unlockedCount}</div>
          <div className="text-sm text-muted-foreground">Locked</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
          <div className="text-sm text-muted-foreground">Completion</div>
        </CardContent>
      </Card>
    </div>
  )
}