"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { MessageSquare, Send, AlertTriangle } from 'lucide-react'
import { REPORT_REASONS, VALIDATION_RULES } from '@/lib/constants'
import { ReportFormData, Question } from '@/types'

interface ReportQuestionModalProps {
  question: Question
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: ReportFormData) => void
}

export function ReportQuestionModal({ 
  question, 
  isOpen, 
  onClose, 
  onSubmit 
}: ReportQuestionModalProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    reason: 'other',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description'
    } else if (formData.description.length > VALIDATION_RULES.REPORT_DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be less than ${VALIDATION_RULES.REPORT_DESCRIPTION_MAX_LENGTH} characters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSubmit(formData)
      
      // Reset form
      setFormData({ reason: 'other', description: '' })
      setErrors({})
      onClose()
    } catch {
      setErrors({ general: 'Failed to submit report. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ reason: 'other', description: '' })
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Report Question
          </DialogTitle>
          <DialogDescription>
            Help us improve by reporting issues with this question
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-md flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {errors.general}
            </div>
          )}

          {/* Question Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Question:</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {question.question}
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for reporting</Label>
            <select
              id="reason"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value as ReportFormData['reason'])}
              disabled={isSubmitting}
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Please describe the issue in detail..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={VALIDATION_RULES.REPORT_DESCRIPTION_MAX_LENGTH}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{errors.description && <span className="text-error">{errors.description}</span>}</span>
              <span>{formData.description.length}/{VALIDATION_RULES.REPORT_DESCRIPTION_MAX_LENGTH}</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Notification component for successful report submission
export function ReportSuccessNotification({ 
  isVisible, 
  onHide 
}: { 
  isVisible: boolean
  onHide: () => void 
}) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 5000) // Hide after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
            <MessageSquare className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-green-900 dark:text-green-100">
              Report Submitted
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Thank you for your feedback. We&apos;ll review your report and take appropriate action.
            </p>
          </div>
          <button
            onClick={onHide}
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}