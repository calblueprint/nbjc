import { PrismaClient, Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';
import parseValidationError from 'utils/parseValidationError';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const isSubmit = req.query.submitting === 'true';

  const { userEmail, ...body } = req.body;
  const { error, value } = OrganizationSchema.validate(body, {
    abortEarly: false,
    context: {
      strict: isSubmit,
    },
  });
  if (error) {
    return CreateError(400, parseValidationError(error), res);
  }

  const user = await prisma.user.findOne({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
    },
  });

  const userId = user?.id;
  if (!userId) {
    return CreateError(500, 'Failed to find user', res);
  }

  const applicationStatus = isSubmit ? 'submitted' : 'draft';
  const active = isSubmit ? false : undefined;
  const data = { ...value, applicationStatus, active } as Organization;

  try {
    const newOrg = await prisma.organization.upsert({
      where: {
        userId,
      },
      create: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        ...data,
      },
    });
    return res.json(newOrg);
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create organization', res);
  }
};
