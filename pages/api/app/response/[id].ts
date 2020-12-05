import Joi, { ValidationError } from 'joi';
import { PrismaClient, ApplicationResponse } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import { AppResponseSchema } from 'interfaces/appQuestion';

const prisma = new PrismaClient();

/**
 * Update an Organization by the given ID and fields and return the updated Organization
 * @param id - the ID of the Organization
 * @param body - the fields of the Organization to update
 */
export const updateResponse = async (
  id: string,
  body: ApplicationResponse
): Promise<ApplicationResponse | null> => {
  const { error, value } = AppResponseSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as ApplicationResponse;

  const updatedResponse = await prisma.applicationResponse.update({
    where: { id: Number(id) },
    data: {
      answer: data.answer,
      organization: data.organizationId
        ? {
            connect: { id: data.organizationId },
          }
        : undefined,
      applicationQuestion: data.questionId
        ? {
            connect: { id: data.questionId },
          }
        : undefined,
    },
  });

  return updatedResponse;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'PATCH') {
    return MethodNotAllowed(req.method, res);
  }
  const responseId = req.query.id as string;

  if (Joi.number().validate(responseId).error) {
    return CreateError(400, `ID ${responseId} is not a number`, res);
  }

  try {
    const response = await updateResponse(responseId, req.body);
    return res.json(response);
  } catch (err) {
    if (err instanceof ValidationError) {
      return CreateError(400, err.message, res);
    }
    console.log(err);
    return CreateError(500, `Failed to patch response ${responseId}`, res);
  }
};
