import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'utils/prisma';

import CreateError, { MethodNotAllowed } from 'utils/error';
import Joi from 'joi';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const orgId = req.query.id as string;
  const { reason } = req.body;

  if (Joi.number().integer().validate(orgId).error) {
    return CreateError(400, `ID ${orgId} is not a number`, res);
  }

  // Converting orgId to number since we know it is a number at this point.
  const orgIdNum = parseFloat(orgId);

  try {
    // Make the current organization rejected
    await prisma.organization.update({
      where: { id: Number(orgId) },
      data: { applicationStatus: 'rejected' },
    });
    // Create a rejection review for the organziation
    await prisma.organizationApplicationReview.create({
      data: {
        reason,
        organization: {
          connect: { id: orgIdNum },
        },
      },
    });
    return res.status(200).json({ status: 'success' });
  } catch (err) {
    return CreateError(500, `Failed to reject organization ${orgId}`, res);
  }
};
