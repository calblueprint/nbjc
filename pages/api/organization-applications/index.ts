import { PrismaClient, OrganizationApplication } from '@prisma/client';
import Joi, { ValidationError } from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import OrganizationApplicationSchema from '../../../interfaces/organization_application';

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
    data: {
      applicationStatus: data.applicationStatus,
      organizationName: data.organizationName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      organizationType: data.organizationType,
      workType: data.workType,
      address: data.address,
      lat: data.lat,
      long: data.long,
      missionStatement: data.missionStatement,
      shortHistory: data.shortHistory,
      keyValue: data.keyValue,
      lgbtqDemographic: data.lgbtqDemographic,
      raceDemographic: data.raceDemographic,
      ageDemographic: data.ageDemographic,
      capacity: data.capacity,
      ein: data.ein,
      foundingDate: data.foundingDate,
    },
  });
  return createdOrgApp;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgAppId = req.query.id as string;
  if (Joi.number().validate(orgAppId).error) {
    return CreateError(400, `ID ${orgAppId} is not a number`, res);
  }

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
    return CreateError(
      500,
      `Failed to create organization application ${orgAppId}`,
      res
    );
  }
};
