'use client'

import { useState, useEffect } from 'react'
import { getGuides } from '@/lib/api'
import { mockGuides } from '@/lib/mock-data'
import type { Guide } from '@/lib/types'

interface UseGuidesOptions {
  status?: string
  vocId?: string
  useMock?: boolean
}

export function useGuides(options: UseGuidesOptions = {}) {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGuides() {
      setLoading(true)
      setError(null)

      try {
        if (options.useMock) {
          // Use mock data for development
          let filtered = mockGuides

          if (options.status) {
            filtered = filtered.filter(g => g.status === options.status)
          }
          if (options.vocId) {
            filtered = filtered.filter(g => g.vocId === options.vocId)
          }

          setGuides(filtered)
        } else {
          const data = await getGuides({
            status: options.status,
            vocId: options.vocId,
          })
          setGuides(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch guides')
        // Fallback to mock data on error
        setGuides(mockGuides)
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [options.status, options.vocId, options.useMock])

  return { guides, loading, error }
}
