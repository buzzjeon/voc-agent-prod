'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GuideEditor } from '@/components/guide-editor'
import { ApprovalWorkflow } from '@/components/approval-workflow'
import { getGuide, approveGuide } from '@/lib/api'
import { mockGuides } from '@/lib/mock-data'
import { GUIDE_STATUS_LABELS } from '@/lib/constants'
import type { Guide } from '@/lib/types'

function getStatusVariant(status: string) {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending_approval':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'default'
  }
}

export default function GuideDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGuide() {
      try {
        const data = await getGuide(id)
        setGuide(data)
      } catch (error) {
        // Fallback to mock data
        const mockGuide = mockGuides.find((g) => g.id === id)
        if (mockGuide) {
          setGuide(mockGuide)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGuide()
  }, [id])

  const handleApprove = async (feedback?: string) => {
    try {
      await approveGuide({ guideId: id, approved: true, feedback })
      alert('Guide approved successfully!')
      router.push('/guides')
    } catch (error) {
      alert('Failed to approve guide. This is a mock environment.')
      console.error(error)
    }
  }

  const handleReject = async (feedback: string) => {
    try {
      await approveGuide({ guideId: id, approved: false, feedback })
      alert('Guide rejected.')
      router.push('/guides')
    } catch (error) {
      alert('Failed to reject guide. This is a mock environment.')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading guide...</div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Guide not found</p>
        <Link href="/guides" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to guides list
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/guides" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          ← Back to guides list
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.title}</h1>
            <div className="flex items-center gap-3">
              <Link href={`/voc/${guide.vocId}`} className="text-sm text-blue-600 hover:underline">
                VOC ID: {guide.vocId}
              </Link>
              <Badge variant={getStatusVariant(guide.status)}>
                {GUIDE_STATUS_LABELS[guide.status]}
              </Badge>
              <span className="text-sm text-gray-500">
                Created: {new Date(guide.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Guide Details</h2>
            </CardHeader>
            <CardBody>
              <GuideEditor guide={guide} readOnly />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          {guide.status === 'pending_approval' && (
            <ApprovalWorkflow
              guide={guide}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {(guide.status === 'approved' || guide.status === 'rejected') && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Status</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <Badge variant={getStatusVariant(guide.status)}>
                    {GUIDE_STATUS_LABELS[guide.status]}
                  </Badge>
                  {guide.approvedBy && (
                    <div className="text-sm text-gray-600">
                      <div>Approved by: {guide.approvedBy}</div>
                      {guide.approvedAt && (
                        <div>At: {new Date(guide.approvedAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Metadata</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Guide ID</div>
                <div className="mt-1 text-sm text-gray-900 font-mono">{guide.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">VOC ID</div>
                <div className="mt-1">
                  <Link href={`/voc/${guide.vocId}`} className="text-sm text-blue-600 hover:underline font-mono">
                    {guide.vocId}
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Created</div>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(guide.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Last Updated</div>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(guide.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
