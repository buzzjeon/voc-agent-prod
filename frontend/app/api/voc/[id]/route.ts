import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, notFoundResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const voc = await prisma.vOC.findUnique({
      where: { id },
      include: {
        guides: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!voc) {
      return notFoundResponse('VOC not found');
    }

    return successResponse(voc);
  } catch (error) {
    console.error('Error fetching VOC:', error);
    return internalErrorResponse();
  }
}
