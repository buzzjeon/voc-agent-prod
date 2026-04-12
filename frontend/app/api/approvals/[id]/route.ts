import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateApprovalSchema } from '@/lib/utils/validation';
import { isValidTransition } from '@/lib/utils/state-machine';
import {
  successResponse,
  notFoundResponse,
  badRequestResponse,
  internalErrorResponse,
  errorResponse,
} from '@/lib/utils/api-response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = updateApprovalSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse('Invalid input');
    }

    const { status, comment } = validation.data;

    // Check if approval exists
    const approval = await prisma.approval.findUnique({
      where: { id },
      include: {
        guide: true,
      },
    });

    if (!approval) {
      return notFoundResponse('Approval not found');
    }

    // Validate status transition
    if (!isValidTransition('APPROVAL', approval.status, status)) {
      return errorResponse(
        `Invalid status transition from ${approval.status} to ${status}`,
        'INVALID_STATE_TRANSITION',
        400
      );
    }

    // Require comment for rejection
    if (status === 'REJECTED' && !comment) {
      return badRequestResponse('Comment is required when rejecting');
    }

    // Update approval
    const updated = await prisma.approval.update({
      where: { id },
      data: {
        status,
        comment,
      },
    });

    // Update guide status based on approval status
    let newGuideStatus: string | undefined;

    if (status === 'APPROVED') {
      newGuideStatus = 'APPROVED';
    } else if (status === 'REJECTED') {
      newGuideStatus = 'DRAFT';
    }

    if (newGuideStatus) {
      await prisma.guide.update({
        where: { id: approval.guideId },
        data: { status: newGuideStatus },
      });
    }

    return successResponse(updated);
  } catch (error) {
    console.error('Error updating approval:', error);
    return internalErrorResponse();
  }
}
