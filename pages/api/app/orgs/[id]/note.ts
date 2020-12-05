import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import CreateError, { MethodNotAllowed } from 'utils/error';
import Joi from 'joi';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') return MethodNotAllowed(req.method, res);

  if (Joi.number().integer().validate(req.query.id).error) {
    return CreateError(400, `ID ${req.query.id} is not a number`, res);
  }
  const organizationId = Number(req.query.id);

  const dataNote = req.body?.note;

  if (Joi.string().empty('').validate(dataNote).error) {
    return CreateError(400, `Note should be a string`, res);
  }

  const note = dataNote as string;
  try {
    const theNote = await prisma.applicationNote.upsert({
      where: { organizationId },
      update: { note },
      create: {
        note,
        organization: { connect: { id: organizationId } },
      },
    });
    return res.json(theNote);
  } catch (ex) {
    return CreateError(
      500,
      `Failed to auto-save note for ${organizationId}`,
      res
    );
  }
};
