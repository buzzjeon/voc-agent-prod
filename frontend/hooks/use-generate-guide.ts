'use client'

import { useState } from 'react'
import { generateGuide } from '@/lib/api'
import type { Guide } from '@/lib/types'

export function useGenerateGuide() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guide, setGuide] = useState<Guide | null>(null)

  const generate = async (vocId: string) => {
    setLoading(true)
    setError(null)
    setGuide(null)

    try {
      const result = await generateGuide({ vocId })
      setGuide(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate guide'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, guide }
}
