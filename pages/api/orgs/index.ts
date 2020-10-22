import { PrismaClient, Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = OrganizationSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as Organization;

  try {
    const newOrg = await prisma.organization.create({
      data: {
        name: data.name,
        long: data.long,
        lat: data.lat,
        type: data.type,
      },
    });
    return res.json(newOrg);
  } catch (err) {
    return CreateError(500, 'Failed to create organization', res);
  }
};
