import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';

export const getAllOrganizations = async (): Promise<Organization[] | null> => {
  const orgs = await prisma.organization.findMany();
  return orgs;
};

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
      data,
    });
    return res.json(newOrg);
  } catch (err) {
    return CreateError(500, 'Failed to create organization', res);
  }
};
