import prisma from 'utils/prisma';
import { OrganizationProject } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import OrgProjSchema from 'interfaces/orgProjects';
import CreateError, { MethodNotAllowed } from 'utils/error';

/**
 * Update an OrgProject by the given ID and fields and return the updated OrgProject
 * @param id - the ID of the OrgProject
 * @param body - the fields of the OrgProject to update
 */
export const updateOrgProject = async (
  id: string,
  body: OrganizationProject
): Promise<OrganizationProject | null> => {
  const { error, value } = OrgProjSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as OrganizationProject;

  const updatedProj = await prisma.organizationProject.update({
    where: { id: Number(id) },
    data,
  });
  return updatedProj;
};

/**
 * Delete the OrgProject by the given ID
 * @param id - the ID of the OrgProject
 */
export const deleteOrgProject = async (
  id: string
): Promise<OrganizationProject | null> => {
  const deletedProj = await prisma.organizationProject.delete({
    where: { id: Number(id) },
  });
  return deletedProj;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgId = req.query.id as string;

  // No GET requests being exposed.

  if (Joi.number().validate(orgId).error) {
    return CreateError(400, `ID ${orgId} is not a number`, res);
  }
  if (req.method === 'PATCH') {
    try {
      const response = await updateOrgProject(orgId, req.body);
      return res.json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        return CreateError(400, err.message, res);
      }
      return CreateError(500, `Failed to patch org project ${orgId}`, res);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedProj = await deleteOrgProject(orgId);
      return res.json(deletedProj);
    } catch (err) {
      return CreateError(500, `Failed to delete org project ${orgId}`, res);
    }
  }
  return MethodNotAllowed(req.method, res);
};
