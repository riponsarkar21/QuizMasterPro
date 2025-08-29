"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MainLayout } from '@/components/layout/main-layout'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import { Chapter, ChapterFormData } from '@/types'
import { formatDate, generateId } from '@/lib/utils'

export default function AdminChaptersPage() {
  // Mock chapters data
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      title: 'Algebra',
      description: 'Linear equations, quadratic equations, polynomials',
      difficulty: 'easy',
      questionCount: 45,
      isActive: true,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-15'),
    },
    {
      id: '2',
      title: 'Geometry',
      description: 'Shapes, angles, areas, and coordinate geometry',
      difficulty: 'medium',
      questionCount: 38,
      isActive: true,
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-12'),
    },
    {
      id: '3',
      title: 'Calculus',
      description: 'Derivatives, integrals, limits, and applications',
      difficulty: 'hard',
      questionCount: 52,
      isActive: true,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-18'),
    },
    {
      id: '4',
      title: 'Statistics',
      description: 'Probability, distributions, hypothesis testing',
      difficulty: 'medium',
      questionCount: 33,
      isActive: false,
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-10'),
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    description: '',
    difficulty: 'easy',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (field: keyof ChapterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (editingChapter) {
      // Update existing chapter
      setChapters(prev => prev.map(chapter =>
        chapter.id === editingChapter.id
          ? {
              ...chapter,
              ...formData,
              updatedAt: new Date()
            }
          : chapter
      ))
    } else {
      // Add new chapter
      const newChapter: Chapter = {
        id: generateId(),
        ...formData,
        questionCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setChapters(prev => [...prev, newChapter])
    }

    handleCloseDialog()
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setFormData({
      title: chapter.title,
      description: chapter.description,
      difficulty: chapter.difficulty,
    })
    setShowAddDialog(true)
  }

  const handleDelete = (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      setChapters(prev => prev.filter(chapter => chapter.id !== chapterId))
    }
  }

  const handleToggleActive = (chapterId: string) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, isActive: !chapter.isActive, updatedAt: new Date() }
        : chapter
    ))
  }

  const handleCloseDialog = () => {
    setShowAddDialog(false)
    setEditingChapter(null)
    setFormData({ title: '', description: '', difficulty: 'easy' })
    setErrors({})
  }

  const getDifficultyColor = (difficulty: Chapter['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Manage Chapters</h1>
            <p className="text-muted-foreground">
              Create and manage quiz chapters and topics
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chapters by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters Table */}
        <Card>
          <CardHeader>
            <CardTitle>Chapters ({filteredChapters.length})</CardTitle>
            <CardDescription>
              Manage your quiz chapters and their settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{chapter.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm text-muted-foreground">
                        {chapter.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(chapter.difficulty)}>
                        {chapter.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{chapter.questionCount}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(chapter.id)}
                        className={chapter.isActive ? 'text-green-600' : 'text-gray-500'}
                      >
                        {chapter.isActive ? (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(chapter.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(chapter)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(chapter.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredChapters.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No chapters found matching your search' : 'No chapters created yet'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first chapter to get started'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Chapter Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </DialogTitle>
              <DialogDescription>
                {editingChapter ? 'Update chapter information' : 'Create a new chapter for organizing questions'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter chapter title"
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-sm text-error">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter chapter description"
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.description && <span className="text-error">{errors.description}</span>}</span>
                  <span>{formData.description.length}/500</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value as ChapterFormData['difficulty'])}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingChapter ? 'Update Chapter' : 'Create Chapter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}