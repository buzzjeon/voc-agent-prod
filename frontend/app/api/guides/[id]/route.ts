import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateGuideSchema } from '@/lib/utils/validation';
import { isValidTransition } from '@/lib/utils/state-machine';
import {
  successResponse,
  notFoundResponse,
  badRequestResponse,
  internalErrorResponse,
  errorResponse,
} from '@/lib/utils/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const guide = await prisma.guide.findUnique({
      where: { id },
      include: {
        voc: {
          select: {
            id: true,
            jiraKey: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!guide) {
      return notFoundResponse('Guide not found');
    }

    return successResponse(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return internalErrorResponse();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = updateGuideSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse('Invalid input');
    }

    const data = validation.data;

    // Check if guide exists
    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return notFoundResponse('Guide not found');
    }

    // Validate status transition if status is being updated
    if (data.status && data.status !== guide.status) {
      if (!isValidTransition('GUIDE', guide.status, data.status)) {
        return errorResponse(
          `Invalid status transition from ${guide.status} to ${data.status}`,
          'INVALID_STATE_TRANSITION',
          400
        );
      }

      // Special validation for PENDING_APPROVAL
      if (data.status === 'PENDING_APPROVAL') {
        // Ensure all required fields are filled
        if (!guide.title || !guide.problem || !guide.cause || !guide.procedure || !guide.solution) {
          return badRequestResponse('All guide fields must be completed before requesting approval');
        }
      }

      // Special validation for PUBLISHED
      if (data.status === 'PUBLISHED' && guide.status !== 'APPROVED') {
        return errorResponse(
          'Guide must be approved before publishing',
          'INVALID_STATE_TRANSITION',
          400
        );
      }
    }

    const updated = await prisma.guide.update({
      where: { id },
      data,
      include: {
        voc: {
          select: {
            id: true,
            jiraKey: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // If guide is published, check if we should update VOC status to RESOLVED
    if (data.status === 'PUBLISHED') {
      const voc = await prisma.vOC.findUnique({
        where: { id: updated.vocId },
      });

      if (voc && voc.status === 'IN_PROGRESS') {
        await prisma.vOC.update({
          where: { id: voc.id },
          data: { status: 'RESOLVED' },
        });
      }
    }

    return successResponse(updated);
  } catch (error) {
    console.error('Error updating guide:', error);
    return internalErrorResponse();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return notFoundResponse('Guide not found');
    }

    // Prevent deletion of published guides
    if (guide.status === 'PUBLISHED') {
      return badRequestResponse('Cannot delete published guides');
    }

    await prisma.guide.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return internalErrorResponse();
  }
}
