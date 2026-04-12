import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { vocQuerySchema } from '@/lib/utils/validation';
import { successResponse, badRequestResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      priority: searchParams.get('priority') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validation = vocQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return badRequestResponse('Invalid query parameters');
    }

    const { status, category, priority, page, limit } = validation.data;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(category && { category }),
      ...(priority && { priority }),
    };

    const [items, total] = await Promise.all([
      prisma.vOC.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          jiraKey: true,
          title: true,
          description: true,
          category: true,
          status: true,
          priority: true,
          reporter: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.vOC.count({ where }),
    ]);

    return successResponse({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching VOCs:', error);
    return internalErrorResponse();
  }
}
