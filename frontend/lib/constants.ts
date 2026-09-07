export const VOC_STATUS_LABELS = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
} as const

export const VOC_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const

export const GUIDE_STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
} as const

export const CATEGORY_OPTIONS = [
  'Authentication',
  'Payment',
  'Performance',
  'UI/UX',
  'API',
  'Database',
  'Security',
  'Other',
] as const

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
