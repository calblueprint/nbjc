import { PrismaClient, OrganizationApplication } from '@prisma/client';
import Joi, { ValidationError } from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import OrganizationApplicationSchema from '../../../interfaces/organizationApplication';

const prisma = new PrismaClient();

export const createOrganizationApp = async (
  body: OrganizationApplication
): Promise<OrganizationApplication | null> => {
  const { error, value } = OrganizationApplicationSchema.validate(body);
  if (error) {
    throw error;
  }
  const data = value as OrganizationApplication;
  const createdOrgApp = await prisma.organizationApplication.create({
    data,
  });
  return createdOrgApp;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }
  try {
    const orgapp = await createOrganizationApp(req.body);
    if (!orgapp) {
      res.status(204);
    }
    return res.json(orgapp);
  } catch (err) {
    if (err instanceof ValidationError) {
      return CreateError(400, err.message, res);
    }
    return CreateError(500, `Failed to create organization application.`, res);
  }
};
