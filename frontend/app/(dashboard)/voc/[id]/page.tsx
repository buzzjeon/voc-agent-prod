'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGenerateGuide } from '@/hooks/use-generate-guide'
import { useGuides } from '@/hooks/use-guides'
import { getVOC } from '@/lib/api'
import { mockVOCs } from '@/lib/mock-data'
import { VOC_STATUS_LABELS, VOC_PRIORITY_LABELS } from '@/lib/constants'
import type { VOC } from '@/lib/types'

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'danger'
    case 'HIGH':
      return 'warning'
    case 'MEDIUM':
      return 'info'
    default:
      return 'default'
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'RESOLVED':
      return 'success'
    case 'IN_PROGRESS':
      return 'warning'
    default:
      return 'default'
  }
}

export default function VOCDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [voc, setVoc] = useState<VOC | null>(null)
  const [loading, setLoading] = useState(true)

  const { generate, loading: generating } = useGenerateGuide()
  const { guides } = useGuides({ vocId: id, useMock: true })

  useEffect(() => {
    async function fetchVOC() {
      try {
        const data = await getVOC(id)
        setVoc(data)
      } catch (error) {
        // Fallback to mock data
        const mockVoc = mockVOCs.find((v) => v.id === id)
        if (mockVoc) {
          setVoc(mockVoc)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVOC()
  }, [id])

  const handleGenerateGuide = async () => {
    try {
      const guide = await generate(id)
      alert('Guide generated successfully!')
      router.push(`/guides/${guide.id}`)
    } catch (error) {
      alert('Failed to generate guide. This is a mock environment.')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading VOC...</div>
      </div>
    )
  }

  if (!voc) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">VOC not found</p>
        <Link href="/voc" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to VOC list
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/voc" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          ← Back to VOC list
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{voc.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-gray-500">{voc.jiraKey}</span>
          <Badge variant={getPriorityVariant(voc.priority)}>
            {VOC_PRIORITY_LABELS[voc.priority]}
          </Badge>
          <Badge variant={getStatusVariant(voc.status)}>
            {VOC_STATUS_LABELS[voc.status]}
          </Badge>
          <span className="text-sm text-gray-500 ml-auto">
            Created: {new Date(voc.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Description</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 whitespace-pre-wrap">{voc.description}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Details</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="mt-1 text-gray-900">{voc.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(voc.status)}>
                      {VOC_STATUS_LABELS[voc.status]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Priority</div>
                  <div className="mt-1">
                    <Badge variant={getPriorityVariant(voc.priority)}>
                      {VOC_PRIORITY_LABELS[voc.priority]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="mt-1 text-gray-900">
                    {new Date(voc.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Actions</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleGenerateGuide}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate AI Guide'}
              </Button>
              <a
                href={`https://jira.example.com/browse/${voc.jiraKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  Open in JIRA
                </Button>
              </a>
            </CardBody>
          </Card>

          {guides.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Related Guides</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {guides.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-sm mb-1 line-clamp-2">
                        {guide.title}
                      </div>
                      <Badge variant={guide.status === 'APPROVED' ? 'success' : 'warning'}>
                        {guide.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
