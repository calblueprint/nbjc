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

  const { userEmail, ...body } = req.body;
  const { error, value } = OrganizationSchema.validate(body);
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as Organization;
  const user = await prisma.user.findOne({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
    },
  });

  const currUserId = user?.id;
  if (!currUserId) {
    return CreateError(500, 'Failed to find user', res);
  }

  try {
    const newOrg = await prisma.organization.upsert({
      where: {
        userId: currUserId,
      },
      create: {
        ...data,
        user: {
          connect: {
            id: currUserId,
          },
        },
      },
      update: {
        ...data,
        user: {
          connect: {
            id: currUserId,
          },
        },
      },
    });
    return res.json(newOrg);
  } catch (err) {
    return CreateError(500, 'Failed to create organization', res);
  }
};
