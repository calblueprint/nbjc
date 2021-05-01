import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';
import { GeneralTeamMember } from 'interfaces/profile';

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

  // Incorporate validation later.

  // const { error, value } = OrganizationSchema.validate(req.body, {
  //   context: { strict: true },
  // });
  // if (error) {
  //   return CreateError(400, error.message, res);
  // }

  const data = req.body as GeneralTeamMember[];

  // Splitting members
  const toCreate = data.filter((mem) => !mem.id && mem.name && mem.title);
  const toUpdate = data.filter(({ id }) => !!id);

  // try {
  //   const newMembers = await prisma.orgTeamMember.upsert({
  //     where: {
  //       data.orgId
  //     },
  //     create: {
  //       ...data
  //     }
  //   })
  //     data,
  //   });
  //   return res.json(newOrg);
  // } catch (err) {
  //   return CreateError(500, 'Failed to create organization', res);
  // }
};
