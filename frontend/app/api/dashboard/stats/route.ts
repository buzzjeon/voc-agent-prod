import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const [
      totalVOCs,
      newVOCs,
      inProgressVOCs,
      resolvedVOCs,
      totalGuides,
      draftGuides,
      pendingGuides,
      approvedGuides,
    ] = await Promise.all([
      prisma.vOC.count(),
      prisma.vOC.count({ where: { status: 'NEW' } }),
      prisma.vOC.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.vOC.count({ where: { status: 'RESOLVED' } }),
      prisma.guide.count(),
      prisma.guide.count({ where: { status: 'DRAFT' } }),
      prisma.guide.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.guide.count({ where: { status: 'APPROVED' } }),
    ]);

    return successResponse({
      vocs: {
        total: totalVOCs,
        new: newVOCs,
        inProgress: inProgressVOCs,
        resolved: resolvedVOCs,
      },
      guides: {
        total: totalGuides,
        draft: draftGuides,
        pending: pendingGuides,
        approved: approvedGuides,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return internalErrorResponse();
  }
}
