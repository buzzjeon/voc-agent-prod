'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/search-bar'
import { VOCCard } from '@/components/voc-card'
import { useVOCs } from '@/hooks/use-vocs'
import { CATEGORY_OPTIONS, VOC_STATUS_LABELS, VOC_PRIORITY_LABELS } from '@/lib/constants'

export default function VOCListPage() {
  const [filters, setFilters] = useState<{
    search?: string
    category?: string
    status?: string
    priority?: string
  }>({})

  const { vocs, loading, error } = useVOCs({ ...filters, useMock: true })

  const statuses = Object.entries(VOC_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  const priorities = Object.entries(VOC_PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VOC Management</h1>
        <p className="text-gray-600">Browse and manage customer issues</p>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={setFilters}
          categories={[...CATEGORY_OPTIONS]}
          statuses={statuses}
          priorities={priorities}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading VOCs...</div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            API connection failed. Showing mock data. Error: {error}
          </p>
        </div>
      )}

      {!loading && vocs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No VOCs found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}

      {!loading && vocs.length > 0 && (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Found {vocs.length} VOC{vocs.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocs.map((voc) => (
              <VOCCard key={voc.id} voc={voc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
