import { ApplicationQuestion } from '@prisma/client';
import prisma from 'utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import { AppQuestionSchema } from 'interfaces/appQuestion';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = AppQuestionSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as ApplicationQuestion;

  try {
    const newQuestion = await prisma.applicationQuestion.create({
      data,
    });
    return res.json(newQuestion);
  } catch (err) {
    return CreateError(500, 'Failed to create custom question', res);
  }
};
