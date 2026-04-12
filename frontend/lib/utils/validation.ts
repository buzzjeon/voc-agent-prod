import { z } from 'zod';

// VOC Validation Schemas
export const vocQuerySchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED']).optional(),
  category: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Guide Validation Schemas
export const guideQuerySchema = z.object({
  vocId: z.string().optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED']).optional(),
  authorId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createGuideSchema = z.object({
  vocId: z.string().cuid(),
  title: z.string().min(1).max(200),
  problem: z.string().min(1),
  cause: z.string().min(1),
  procedure: z.string().min(1),
  solution: z.string().min(1),
  sources: z.string().min(1),
  authorId: z.string().cuid(),
});

export const updateGuideSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  problem: z.string().min(1).optional(),
  cause: z.string().min(1).optional(),
  procedure: z.string().min(1).optional(),
  solution: z.string().min(1).optional(),
  sources: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED']).optional(),
});

export const generateGuideSchema = z.object({
  vocId: z.string().cuid(),
  authorId: z.string().cuid(),
});

// Approval Validation Schemas
export const createApprovalSchema = z.object({
  guideId: z.string().cuid(),
  approverId: z.string().cuid(),
});

export const updateApprovalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  comment: z.string().optional(),
});

// Jira Webhook Schema
export const jiraWebhookSchema = z.object({
  webhookEvent: z.string(),
  issue: z.object({
    key: z.string(),
    fields: z.object({
      summary: z.string(),
      description: z.string().optional().default(''),
      priority: z.object({
        name: z.string(),
      }),
      reporter: z.object({
        displayName: z.string(),
      }),
      customfield_category: z.string().optional(),
    }),
  }),
});
