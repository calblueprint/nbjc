import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';

/**
 * Retrieve an Organization by its ID
 * @param id - the ID of the Organization
 */
export const getOrganization = async (
  id: string
): Promise<Organization | null> => {
  const org = await prisma.organization.findUnique({
    where: { id: Number(id) },
  });
  return org;
};

/**
 * Update an Organization by the given ID and fields and return the updated Organization
 * @param id - the ID of the Organization
 * @param body - the fields of the Organization to update
 */
export const updateOrganization = async (
  id: string,
  body: Organization
): Promise<Organization | null> => {
  const { error, value } = OrganizationSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as Organization;

  const updatedOrg = await prisma.organization.update({
    where: { id: Number(id) },
    data,
  });
  return updatedOrg;
};

/**
 * Delete the Organization by the given ID
 * @param id - the ID of the Organization
 */
export const deleteOrganization = async (
  id: string
): Promise<Organization | null> => {
  const deletedOrg = await prisma.organization.delete({
    where: { id: Number(id) },
  });
  return deletedOrg;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgId = req.query.id as string;

  if (Joi.number().validate(orgId).error) {
    return CreateError(400, `ID ${orgId} is not a number`, res);
  }

  if (req.method === 'GET') {
    try {
      const org = await getOrganization(orgId);

      if (!org) {
        res.status(204);
      }

      return res.json(org);
    } catch (err) {
      return CreateError(500, `Failed to get organization ${orgId}`, res);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const response = await updateOrganization(orgId, req.body);
      return res.json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        return CreateError(400, err.message, res);
      }
      return CreateError(500, `Failed to patch organization ${orgId}`, res);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedOrg = await deleteOrganization(orgId);
      return res.json(deletedOrg);
    } catch (err) {
      return CreateError(500, `Failed to delete organization ${orgId}`, res);
    }
  }
  return MethodNotAllowed(req.method, res);
};
