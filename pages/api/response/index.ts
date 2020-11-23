import { PrismaClient, ApplicationResponse } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import ResponseSchema from 'interfaces/response';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = ResponseSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }
  const data = value as ApplicationResponse;

  //   const connectOrg = data.organizationId
  //     ? {
  //         organization: {
  //           connect: { id: data.organizationId },
  //         },
  //       }
  //     : undefined;

  try {
    const newResponse = await prisma.applicationResponse.upsert({
      where: { id: data.id },
      update: {
        answer: data.answer,
      },
      create: {
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
