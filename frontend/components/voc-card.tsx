import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { VOC } from '@/lib/types'

interface VOCCardProps {
  voc: VOC
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    default:
      return 'default'
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'resolved':
      return 'success'
    case 'guide_generated':
      return 'info'
    case 'analyzing':
      return 'warning'
    default:
      return 'default'
  }
}

export function VOCCard({ voc }: VOCCardProps) {
  return (
    <Link href={`/voc/${voc.id}`}>
      <Card hover className="h-full">
        <CardBody>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-500">{voc.jiraKey}</span>
              <Badge variant={getPriorityVariant(voc.priority)}>
                {voc.priority.toUpperCase()}
              </Badge>
            </div>
            <Badge variant={getStatusVariant(voc.status)}>
              {voc.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {voc.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {voc.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">{voc.category}</span>
            <span>{new Date(voc.createdAt).toLocaleDateString()}</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
