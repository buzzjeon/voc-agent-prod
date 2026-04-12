'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Guide } from '@/lib/types'

interface GuideEditorProps {
  guide?: Guide
  onSave?: (guide: Partial<Guide>) => void
  readOnly?: boolean
}

export function GuideEditor({ guide, onSave, readOnly = false }: GuideEditorProps) {
  const [title, setTitle] = useState(guide?.title || '')
  const [problem, setProblem] = useState(guide?.problem || '')
  const [cause, setCause] = useState(guide?.cause || '')
  const [procedure, setProcedure] = useState(guide?.procedure || '')
  const [solution, setSolution] = useState(guide?.solution || '')
  const [sources, setSources] = useState(guide?.sources || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({
        title,
        problem,
        cause,
        procedure,
        solution,
        sources,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={readOnly}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
          Problem
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          disabled={readOnly}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="cause" className="block text-sm font-medium text-gray-700 mb-1">
          Root Cause
        </label>
        <textarea
          id="cause"
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          disabled={readOnly}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="procedure" className="block text-sm font-medium text-gray-700 mb-1">
          Resolution Procedure
        </label>
        <textarea
          id="procedure"
          value={procedure}
          onChange={(e) => setProcedure(e.target.value)}
          disabled={readOnly}
          rows={6}
          placeholder="Step-by-step instructions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 font-mono text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
          Solution Summary
        </label>
        <textarea
          id="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          disabled={readOnly}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="sources" className="block text-sm font-medium text-gray-700 mb-1">
          Sources & References
        </label>
        <textarea
          id="sources"
          value={sources}
          onChange={(e) => setSources(e.target.value)}
          disabled={readOnly}
          rows={3}
          placeholder="Database logs, APM traces, related issues..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      {!readOnly && onSave && (
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save Guide
          </Button>
        </div>
      )}
    </form>
  )
}
