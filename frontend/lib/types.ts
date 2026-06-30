export interface VOC {
  id: string
  jiraKey: string
  title: string
  description: string
  category: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
}

export interface Guide {
  id: string
  vocId: string
  title: string
  problem: string
  cause: string
  procedure: string
  solution: string
  sources: string
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface ApiResponse<T> {
  data: T
  total?: number
}

export interface ApiError {
  error: string
  code?: string
}

export interface GenerateGuideRequest {
  vocId: string
}

export interface ApproveGuideRequest {
  guideId: string
  approved: boolean
  feedback?: string
}

export interface DashboardStats {
  totalVOCs: number
  pendingGuides: number
  approvedGuides: number
  resolvedVOCs: number
}
