import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import CreateError, { MethodNotAllowed } from 'utils/error';
import Joi from 'joi';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const orgId = req.query.id as string;

  if (Joi.number().integer().validate(orgId).error) {
    return CreateError(400, `ID ${orgId} is not a number`, res);
  }

  try {
    await prisma.organization.update({
      where: { id: Number(orgId) },
      data: { applicationStatus: 'approved', active: true },
    });
    return res.status(200).json({ status: 'success' });
  } catch (err) {
    return CreateError(500, `Failed to approve organization ${orgId}`, res);
  }
};
