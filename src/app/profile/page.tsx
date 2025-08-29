"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { AchievementGrid, AchievementStats } from '@/components/achievement/achievement-components'
import { useAuth } from '@/contexts/auth-context'
import { ACHIEVEMENTS, getMockUserAchievements, getAchievementsByCategory } from '@/lib/achievements'
import { UserProfile, UserStatistics, UserAchievement, ChapterStats } from '@/types'
import { 
  User, 
  Edit2, 
  Trophy, 
  Target, 
  Clock, 
  BarChart3, 
  Calendar,
  Medal,
  Flame,
  BookOpen,
  TrendingUp
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStatistics | null>(null)
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  
  // Form states for settings
  const [examSettings, setExamSettings] = useState({
    preferredQuestionCount: 20,
    preferredTimeLimit: 30,
    showExplanations: true,
    randomizeQuestions: true
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    examReminders: true
  })

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'statistics', 'achievements', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleExamSettingsChange = (field: string, value: any) => {
    setExamSettings(prev => ({ ...prev, [field]: value }))
  }
  
  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
  }
  
  const saveExamPreferences = () => {
    // In a real app, this would save to API
    console.log('Saving exam preferences:', examSettings)
    // Update the user profile state
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          examSettings: {
            ...userProfile.preferences.examSettings,
            preferredQuestionCount: examSettings.preferredQuestionCount,
            preferredTimeLimit: examSettings.preferredTimeLimit * 60,
            showExplanations: examSettings.showExplanations,
            randomizeQuestions: examSettings.randomizeQuestions
          }
        }
      })
    }
  }
  
  const saveNotificationSettings = () => {
    // In a real app, this would save to API
    console.log('Saving notification settings:', notificationSettings)
    // Update the user profile state
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          notifications: notificationSettings
        }
      })
    }
  }

  useEffect(() => {
    if (user) {
      // Mock user profile data
      const mockProfile: UserProfile = {
        id: '1',
        userId: user.id,
        bio: 'Passionate learner dedicated to improving mathematical skills and achieving academic excellence.',
        avatar: '',
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            examReminders: true
          },
          examSettings: {
            preferredQuestionCount: 20,
            preferredTimeLimit: 1800, // 30 minutes
            showExplanations: true,
            randomizeQuestions: true
          }
        },
        statistics: {
          totalExamsAttempted: 15,
          totalQuestionsAnswered: 300,
          totalCorrectAnswers: 255,
          averageScore: 85,
          bestScore: 98,
          currentStreak: 7,
          longestStreak: 14,
          totalTimeSpent: 450, // in minutes
          chapterStats: [
            {
              chapterId: '1',
              chapterTitle: 'Algebra',
              attemptsCount: 8,
              averageScore: 88,
              accuracy: 90,
              timeSpent: 180,
              lastAttempted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              isCompleted: true
            },
            {
              chapterId: '2',
              chapterTitle: 'Geometry',
              attemptsCount: 5,
              averageScore: 82,
              accuracy: 85,
              timeSpent: 150,
              lastAttempted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              isCompleted: false
            },
            {
              chapterId: '3',
              chapterTitle: 'Calculus',
              attemptsCount: 2,
              averageScore: 75,
              accuracy: 78,
              timeSpent: 120,
              lastAttempted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              isCompleted: false
            }
          ],
          recentActivity: [
            {
              id: '1',
              type: 'exam_completed',
              description: 'Completed Algebra exam with 92% score',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              id: '2',
              type: 'achievement_unlocked',
              description: 'Unlocked "High Achiever" achievement',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
            },
            {
              id: '3',
              type: 'streak_milestone',
              description: 'Reached 7-day learning streak',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          ]
        },
        achievements: [],
        updatedAt: new Date()
      }

      setUserProfile(mockProfile)
      setUserStats(mockProfile.statistics)
      setUserAchievements(getMockUserAchievements(user.id))
      
      // Initialize form states from profile
      setExamSettings({
        preferredQuestionCount: mockProfile.preferences.examSettings.preferredQuestionCount,
        preferredTimeLimit: mockProfile.preferences.examSettings.preferredTimeLimit / 60,
        showExplanations: mockProfile.preferences.examSettings.showExplanations,
        randomizeQuestions: mockProfile.preferences.examSettings.randomizeQuestions
      })
      
      setNotificationSettings({
        emailNotifications: mockProfile.preferences.notifications.emailNotifications,
        pushNotifications: mockProfile.preferences.notifications.pushNotifications,
        examReminders: mockProfile.preferences.notifications.examReminders
      })
    }
  }, [user])

  if (!user || !userProfile || !userStats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  const accuracy = Math.round((userStats.totalCorrectAnswers / userStats.totalQuestionsAnswered) * 100)

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile and track your learning progress
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      {isEditing ? (
                        <Input value={user.name} className="mt-1" />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    {isEditing ? (
                      <textarea
                        className="mt-1 w-full p-2 text-sm border rounded-md"
                        rows={3}
                        defaultValue={userProfile.bio}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {userProfile.bio || 'No bio added yet.'}
                      </p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button size="sm">Save Changes</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Exams</span>
                      <Badge variant="secondary">{userStats.totalExamsAttempted}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Score</span>
                      <Badge variant="secondary">{userStats.averageScore}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Best Score</span>
                      <Badge variant="secondary">{userStats.bestScore}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accuracy</span>
                      <Badge variant="secondary">{accuracy}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Streak</span>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Flame className="h-3 w-3" />
                        <span>{userStats.currentStreak}</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {activity.type === 'exam_completed' && <Target className="h-4 w-4 text-primary" />}
                        {activity.type === 'achievement_unlocked' && <Trophy className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'streak_milestone' && <Flame className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats.totalExamsAttempted}</div>
                  <div className="text-sm text-muted-foreground">Total Exams</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Medal className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats.bestScore}%</div>
                  <div className="text-sm text-muted-foreground">Best Score</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(userStats.totalTimeSpent / 60)}h</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Chapter Performance</span>
                </CardTitle>
                <CardDescription>Your performance across different chapters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.chapterStats.map((chapter) => (
                    <div key={chapter.chapterId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{chapter.chapterTitle}</h4>
                          {chapter.isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.attemptsCount} attempts
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Score: </span>
                          <span className="font-medium">{chapter.averageScore}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Accuracy: </span>
                          <span className="font-medium">{chapter.accuracy}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time: </span>
                          <span className="font-medium">{Math.round(chapter.timeSpent / 60)}m</span>
                        </div>
                      </div>
                      
                      <Progress value={chapter.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <AchievementStats 
              userAchievements={userAchievements}
              totalAchievements={ACHIEVEMENTS.length}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>All Achievements</span>
                </CardTitle>
                <CardDescription>Track your progress and unlock new achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementGrid 
                  achievements={ACHIEVEMENTS}
                  userAchievements={userAchievements}
                  showProgress={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Preferences</CardTitle>
                <CardDescription>Configure your default exam settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Preferred Question Count</label>
                    <Input
                      type="number"
                      value={examSettings.preferredQuestionCount}
                      onChange={(e) => handleExamSettingsChange('preferredQuestionCount', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preferred Time Limit (minutes)</label>
                    <Input
                      type="number"
                      value={examSettings.preferredTimeLimit}
                      onChange={(e) => handleExamSettingsChange('preferredTimeLimit', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={examSettings.showExplanations}
                      onChange={(e) => handleExamSettingsChange('showExplanations', e.target.checked)}
                    />
                    <span className="text-sm">Show explanations after answering</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={examSettings.randomizeQuestions}
                      onChange={(e) => handleExamSettingsChange('randomizeQuestions', e.target.checked)}
                    />
                    <span className="text-sm">Randomize question order</span>
                  </label>
                </div>
                
                <Button onClick={saveExamPreferences}>Save Preferences</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => handleNotificationSettingsChange('emailNotifications', e.target.checked)}
                  />
                  <span className="text-sm">Email notifications</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => handleNotificationSettingsChange('pushNotifications', e.target.checked)}
                  />
                  <span className="text-sm">Push notifications</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={notificationSettings.examReminders}
                    onChange={(e) => handleNotificationSettingsChange('examReminders', e.target.checked)}
                  />
                  <span className="text-sm">Exam reminders</span>
                </label>
                
                <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}