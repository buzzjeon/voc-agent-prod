import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApprovalSchema } from '@/lib/utils/validation';
import { successResponse, badRequestResponse, notFoundResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createApprovalSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse('Invalid input');
    }

    const { guideId, approverId } = validation.data;

    // Check if guide exists
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      return notFoundResponse('Guide not found');
    }

    // Check if approver exists
    const approver = await prisma.user.findUnique({
      where: { id: approverId },
    });

    if (!approver) {
      return badRequestResponse('Approver not found');
    }

    // Validate guide status - must be PENDING_APPROVAL to create approval
    if (guide.status !== 'PENDING_APPROVAL') {
      return badRequestResponse('Guide must be in PENDING_APPROVAL status');
    }

    // Check if approval already exists for this guide and approver
    const existingApproval = await prisma.approval.findFirst({
      where: {
        guideId,
        approverId,
        status: 'PENDING',
      },
    });

    if (existingApproval) {
      return badRequestResponse('Approval request already exists for this approver');
    }

    const approval = await prisma.approval.create({
      data: {
        guideId,
        approverId,
        status: 'PENDING',
      },
    });

    return successResponse(approval, 201);
  } catch (error) {
    console.error('Error creating approval:', error);
    return internalErrorResponse();
  }
}
