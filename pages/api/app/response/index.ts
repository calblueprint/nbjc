import { ApplicationResponse } from '@prisma/client';
import prisma from 'utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import { AppResponseSchema } from 'interfaces/appQuestion';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = AppResponseSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }
  const data = value as ApplicationResponse;
  try {
    const newResponse = await prisma.applicationResponse.create({
      data: {
        answer: data.answer,
        organization: {
          connect: { id: data.organizationId },
        },
        applicationQuestion: {
          connect: { id: data.questionId },
        },
      },
    });
    return res.json(newResponse);
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create response', res);
  }
};
