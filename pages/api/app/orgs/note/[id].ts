import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import CreateError from 'utils/error';
import Joi from 'joi';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const organizationId = Number(req.query.id);

  if (Joi.number().integer().validate(organizationId).error) {
    return CreateError(400, `ID ${organizationId} is not a number`, res);
  }

  const dataNote = req.body?.note;

  if (Joi.string().validate(dataNote).error) {
    return CreateError(400, `Note should be a string`, res);
  }

  const note = dataNote as string;
  console.log('datanote:', dataNote);
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
    return CreateError(500, `Failed to auto-save note for ${orgId}`, res);
  }
};
