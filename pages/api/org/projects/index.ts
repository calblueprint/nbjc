import { PrismaClient, OrganizationProject } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrgProjectSchema from 'interfaces/orgProjects';
import CreateError, { MethodNotAllowed } from 'utils/error';

const prisma = new PrismaClient();

export const getAllOrganizations = async (): Promise<
  OrganizationProject[] | null
> => {
  const projects = await prisma.organizationProject.findMany();
  return projects;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = OrgProjectSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as OrganizationProject;

  try {
    const newOrg = await prisma.organizationProject.create({
      data: {
        title: data.title,
        description: data.description,
        organizations: {
          connect: { id: data.organizationId },
        },
      },
    });
    return res.json(newOrg);
  } catch (err) {
    return CreateError(500, 'Failed to create org project', res);
  }
};
