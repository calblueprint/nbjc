import { PrismaClient, OrganizationApplication } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import CreateError, { MethodNotAllowed } from 'utils/error';
import OrganizationApplicationSchema from '../../../interfaces/organization_application';

const prisma = new PrismaClient();

export const getOrganizationApp = async (
  id: string
): Promise<OrganizationApplication | null> => {
  const org = await prisma.organizationApplication.findOne({
    where: { id: Number(id) },
  });
  return org;
};

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

export const updateOrganizationApp = async (
  id: string,
  body: OrganizationApplication
): Promise<OrganizationApplication | null> => {
  const { error, value } = OrganizationApplicationSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as OrganizationApplication;

  const updatedOrgApp = await prisma.organizationApplication.update({
    where: { id: Number(id) },
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
  return updatedOrgApp;
};

export const deleteOrganizationApp = async (
  id: string
): Promise<OrganizationApplication | null> => {
  const deletedOrgApp = await prisma.organizationApplication.delete({
    where: { id: Number(id) },
  });
  return deletedOrgApp;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgAppId = req.query.id as string;

  if (Joi.number().validate(orgAppId).error) {
    return CreateError(400, `ID ${orgAppId} is not a number`, res);
  }

  if (req.method === 'GET') {
    try {
      const orgapp = await getOrganizationApp(orgAppId);

      if (!orgapp) {
        res.status(204);
      }

      return res.json(orgapp);
    } catch (err) {
      return CreateError(
        500,
        `Failed to get organization application ${orgAppId}`,
        res
      );
    }
  }
  if (req.method === 'POST') {
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
  }
  if (req.method === 'PATCH') {
    try {
      const response = await updateOrganizationApp(orgAppId, req.body);
      return res.json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        return CreateError(400, err.message, res);
      }
      return CreateError(
        500,
        `Failed to patch organization application ${orgAppId}`,
        res
      );
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedOrgApp = await deleteOrganizationApp(orgAppId);
      return res.json(deletedOrgApp);
    } catch (err) {
      return CreateError(
        500,
        `Failed to delete organization application ${orgAppId}`,
        res
      );
    }
  }
  return MethodNotAllowed(req.method, res);
};
