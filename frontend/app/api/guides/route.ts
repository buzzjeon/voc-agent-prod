import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guideQuerySchema, createGuideSchema } from '@/lib/utils/validation';
import { successResponse, badRequestResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      vocId: searchParams.get('vocId') || undefined,
      status: searchParams.get('status') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validation = guideQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return badRequestResponse('Invalid query parameters');
    }

    const { vocId, status, authorId, page, limit } = validation.data;
    const skip = (page - 1) * limit;

    const where = {
      ...(vocId && { vocId }),
      ...(status && { status }),
      ...(authorId && { authorId }),
    };

    const [items, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.guide.count({ where }),
    ]);

    return successResponse({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createGuideSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse('Invalid input');
    }

    const data = validation.data;

    // Check if VOC exists
    const voc = await prisma.vOC.findUnique({
      where: { id: data.vocId },
    });

    if (!voc) {
      return badRequestResponse('VOC not found');
    }

    // Check if author exists
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      return badRequestResponse('Author not found');
    }

    const guide = await prisma.guide.create({
      data: {
        vocId: data.vocId,
        title: data.title,
        problem: data.problem,
        cause: data.cause,
        procedure: data.procedure,
        solution: data.solution,
        sources: data.sources,
        authorId: data.authorId,
        status: 'DRAFT',
      },
    });

    return successResponse(guide, 201);
  } catch (error) {
    console.error('Error creating guide:', error);
    return internalErrorResponse();
  }
}
