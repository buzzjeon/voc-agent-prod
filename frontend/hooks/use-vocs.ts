'use client'

import { useState, useEffect } from 'react'
import { getVOCs } from '@/lib/api'
import { mockVOCs } from '@/lib/mock-data'
import type { VOC } from '@/lib/types'

interface UseVOCsOptions {
  category?: string
  status?: string
  priority?: string
  search?: string
  useMock?: boolean
}

export function useVOCs(options: UseVOCsOptions = {}) {
  const [vocs, setVocs] = useState<VOC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVOCs() {
      setLoading(true)
      setError(null)

      try {
        if (options.useMock) {
          // Use mock data for development
          let filtered = mockVOCs

          if (options.category) {
            filtered = filtered.filter(v => v.category === options.category)
          }
          if (options.status) {
            filtered = filtered.filter(v => v.status === options.status)
          }
          if (options.priority) {
            filtered = filtered.filter(v => v.priority === options.priority)
          }
          if (options.search) {
            const searchLower = options.search.toLowerCase()
            filtered = filtered.filter(v =>
              v.title.toLowerCase().includes(searchLower) ||
              v.description.toLowerCase().includes(searchLower) ||
              v.jiraKey.toLowerCase().includes(searchLower)
            )
          }

          setVocs(filtered)
        } else {
          const data = await getVOCs({
            category: options.category,
            status: options.status,
            priority: options.priority,
            search: options.search,
          })
          setVocs(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch VOCs')
        // Fallback to mock data on error
        setVocs(mockVOCs)
      } finally {
        setLoading(false)
      }
    }

    fetchVOCs()
  }, [options.category, options.status, options.priority, options.search, options.useMock])

  return { vocs, loading, error }
}
