import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import CreateError from 'utils/error';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgId = req.query.id;
  try {
    await prisma.organization.update({
      where: { id: Number(orgId) },
      data: { applicationStatus: 'rejected', active: true },
    });
    /** Do we want to set active to true when we reject them? */
    return res.status(200).json({ status: 'success' });
  } catch (ex) {
    return CreateError(500, `Failed to reject organization ${orgId}`, res);
  }
};
