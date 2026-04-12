import { API_BASE_URL } from './constants'
import type { VOC, Guide, ApiResponse, ApiError, GenerateGuideRequest, ApproveGuideRequest, DashboardStats } from './types'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      error: `HTTP ${res.status}`,
      code: String(res.status),
    }))
    throw new Error(error.error)
  }

  return res.json()
}

// VOC APIs
export async function getVOCs(filters?: {
  category?: string
  status?: string
  priority?: string
  search?: string
}): Promise<VOC[]> {
  const params = new URLSearchParams()
  if (filters?.category) params.set('category', filters.category)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.priority) params.set('priority', filters.priority)
  if (filters?.search) params.set('search', filters.search)

  const url = `${API_BASE_URL}/api/voc${params.toString() ? `?${params}` : ''}`
  const response = await fetchJson<{ items: VOC[]; total: number; page: number; limit: number }>(url)
  return response.items
}

export async function getVOC(id: string): Promise<VOC> {
  return fetchJson<VOC>(`${API_BASE_URL}/api/voc/${id}`)
}

// Guide APIs
export async function getGuides(filters?: {
  status?: string
  vocId?: string
}): Promise<Guide[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.vocId) params.set('vocId', filters.vocId)

  const url = `${API_BASE_URL}/api/guides${params.toString() ? `?${params}` : ''}`
  const response = await fetchJson<{ items: Guide[]; total: number; page: number; limit: number }>(url)
  return response.items
}

export async function getGuide(id: string): Promise<Guide> {
  return fetchJson<Guide>(`${API_BASE_URL}/api/guides/${id}`)
}

export async function generateGuide(data: GenerateGuideRequest): Promise<Guide> {
  return fetchJson<Guide>(`${API_BASE_URL}/api/guides/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function approveGuide(approvalId: string, approved: boolean, feedback?: string) {
  return fetchJson(`${API_BASE_URL}/api/approvals/${approvalId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: approved ? 'APPROVED' : 'REJECTED',
      comment: feedback,
    }),
  })
}

// Dashboard API
export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchJson<DashboardStats>(`${API_BASE_URL}/api/dashboard/stats`)
}
