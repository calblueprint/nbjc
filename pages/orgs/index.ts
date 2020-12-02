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
  const { error, value } = OrganizationSchema.validate(body, {
    context: { strict: true },
  });
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
  try {
    const newOrg = await prisma.organization.upsert({
      where: {
        userId: currUserId,
      },
      create: {
        name: data.name,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        long: data.long,
        lat: data.lat,
        applicationStatus: data.applicationStatus,
        active: data.active,
        organizationType: data.organizationType,
        workType: data.workType,
        address: data.address,
        missionStatement: data.missionStatement,
        shortHistory: data.shortHistory,
        keyValue: data.keyValue,
        lgbtqDemographic: data.lgbtqDemographic,
        raceDemographic: data.raceDemographic,
        ageDemographic: data.ageDemographic,
        ein: data.ein,
        capacity: data.capacity,
        foundingDate: data.foundingDate,
        is501c3: data.is501c3,
        user: {
          connect: {
            id: data.userId || undefined,
          },
        },
      },
      update: {
        name: data.name,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        long: data.long,
        lat: data.lat,
        applicationStatus: data.applicationStatus,
        active: data.active,
        organizationType: data.organizationType,
        workType: data.workType,
        address: data.address,
        missionStatement: data.missionStatement,
        shortHistory: data.shortHistory,
        keyValue: data.keyValue,
        lgbtqDemographic: data.lgbtqDemographic,
        raceDemographic: data.raceDemographic,
        ageDemographic: data.ageDemographic,
        ein: data.ein,
        capacity: data.capacity,
        foundingDate: data.foundingDate,
        is501c3: data.is501c3,
        user: {
          connect: {
            id: data.userId || undefined,
          },
        },
      },
    });
    return res.json(newOrg);
  } catch (err) {
    return CreateError(500, 'Failed to create organization', res);
  }
};
