'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Guide } from '@/lib/types'

interface ApprovalWorkflowProps {
  guide: Guide
  onApprove: (feedback?: string) => void
  onReject: (feedback: string) => void
}

export function ApprovalWorkflow({ guide, onApprove, onReject }: ApprovalWorkflowProps) {
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = () => {
    setAction('approve')
    setShowFeedback(true)
  }

  const handleReject = () => {
    setAction('reject')
    setShowFeedback(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (action === 'approve') {
      onApprove(feedback || undefined)
    } else if (action === 'reject') {
      if (!feedback.trim()) {
        alert('Please provide feedback for rejection')
        return
      }
      onReject(feedback)
    }
  }

  const handleCancel = () => {
    setShowFeedback(false)
    setAction(null)
    setFeedback('')
  }

  if (guide.status === 'APPROVED') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success">Approved</Badge>
              {guide.approvedBy && (
                <span className="text-sm text-gray-600">by {guide.approvedBy}</span>
              )}
            </div>
            {guide.approvedAt && (
              <p className="text-sm text-gray-500">
                {new Date(guide.approvedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (guide.status === 'DRAFT') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <Badge variant="danger">Rejected</Badge>
      </div>
    )
  }

  if (!showFeedback) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Review Guide</h3>
        <div className="flex gap-3">
          <Button type="button" variant="primary" onClick={handleApprove}>
            Approve
          </Button>
          <Button type="button" variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">
        {action === 'approve' ? 'Approve Guide' : 'Reject Guide'}
      </h3>

      <div className="mb-4">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
          Feedback {action === 'reject' && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder={
            action === 'approve'
              ? 'Optional: Add comments or suggestions...'
              : 'Required: Explain why this guide is being rejected...'
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required={action === 'reject'}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant={action === 'approve' ? 'primary' : 'danger'}>
          Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
