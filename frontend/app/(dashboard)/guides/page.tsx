'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/search-bar'
import { useGuides } from '@/hooks/use-guides'
import { GUIDE_STATUS_LABELS } from '@/lib/constants'
import type { Guide } from '@/lib/types'

function getStatusVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'PENDING_APPROVAL':
      return 'warning'
    case 'PUBLISHED':
      return 'info'
    default:
      return 'default'
  }
}

export default function GuidesListPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<{ status?: string }>({
    status: searchParams.get('status') || undefined,
  })

  const { guides, loading, error } = useGuides({ ...filters, useMock: true })

  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      setFilters({ status })
    }
  }, [searchParams])

  const statuses = Object.entries(GUIDE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guides</h1>
        <p className="text-gray-600">Review and approve AI-generated guides</p>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={setFilters}
          statuses={statuses}
          showPriority={false}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading guides...</div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            API connection failed. Showing mock data. Error: {error}
          </p>
        </div>
      )}

      {!loading && guides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No guides found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}

      {!loading && guides.length > 0 && (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Found {guides.length} guide{guides.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-4">
            {guides.map((guide: Guide) => (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <Card hover>
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {guide.problem}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(guide.status)} className="ml-4">
                        {GUIDE_STATUS_LABELS[guide.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>VOC ID: {guide.vocId}</span>
                        <span>Created: {new Date(guide.createdAt).toLocaleDateString()}</span>
                      </div>
                      {guide.approvedBy && (
                        <span>Approved by: {guide.approvedBy}</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
