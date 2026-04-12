import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jiraWebhookSchema } from '@/lib/utils/validation';
import { successResponse, badRequestResponse, internalErrorResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = jiraWebhookSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse('Invalid webhook payload');
    }

    const { issue } = validation.data;
    const { key, fields } = issue;

    // Check if VOC already exists
    const existing = await prisma.vOC.findUnique({
      where: { jiraKey: key },
    });

    if (existing) {
      // Update existing VOC
      const updated = await prisma.vOC.update({
        where: { jiraKey: key },
        data: {
          title: fields.summary,
          description: fields.description,
          priority: fields.priority.name.toUpperCase(),
          reporter: fields.reporter.displayName,
          category: fields.customfield_category || 'GENERAL',
        },
      });

      return successResponse(
        {
          message: 'Webhook received',
          vocId: updated.id,
        },
        202
      );
    }

    // Create new VOC
    const voc = await prisma.vOC.create({
      data: {
        jiraKey: key,
        title: fields.summary,
        description: fields.description,
        category: fields.customfield_category || 'GENERAL',
        priority: fields.priority.name.toUpperCase(),
        reporter: fields.reporter.displayName,
        status: 'NEW',
      },
    });

    return successResponse(
      {
        message: 'Webhook received',
        vocId: voc.id,
      },
      202
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return internalErrorResponse();
  }
}
