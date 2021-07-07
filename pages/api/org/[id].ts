import prisma from 'utils/prisma';
import { Organization, OrganizationProject } from '@prisma/client';
import Joi, { ValidationError, x } from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import OrganizationSchema, {
  Project,
  ExistingProject,
} from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';
import SplitObjs from 'utils/splitObjs';

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
    console.log('error', error);
    throw error;
  }

  const { organizationProjects, ...data } = value;
  const dataTyped = data as Organization;
  const orgProjects = organizationProjects as Project[];

  const currOrg = await prisma.organization.findUnique({
    where: { id: Number(id) },
    include: { organizationProjects: true },
  });

  const [toCreate, toUpdate, toDelete] = SplitObjs<
    Project,
    OrganizationProject
  >(orgProjects, currOrg?.organizationProjects);

  let newChanges;
  try {
    newChanges = await prisma.organization.upsert({
      where: { id: Number(id) },
      update: {
        ...dataTyped,
        organizationProjects: {
          updateMany: toUpdate?.map(({ id: projId, title, description }) => ({
            where: {
              id: projId,
            },
            data: {
              title,
              description,
            },
          })),
          deleteMany: toDelete.map((id) => ({ id })),
        },
      },
      create: {
        ...dataTyped,
      },
    });
  } catch (err) {
    console.log(err);
    // return CreateError(500, 'Failed to organization', res);
  }

  // Looping and creating-- fixed with createMany functionality in 2.20
  // FIXME: This is a temporary (ugly) solution for creating projects
  if (newChanges) {
    try {
      for (let i = 0; i < toCreate.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const response = await prisma.organizationProject.create({
          data: {
            title: toCreate[i].title,
            description: toCreate[i].description,
            organization: {
              connect: {
                id: newChanges.id,
              },
            },
          },
        });
      }
    } catch (err) {
      console.log('error', err);
      // return CreateError(500, 'Failed to create project', res);
    }
  }

  // Getting all the projects in the DB now and sending it to front-end for projects attribute to become server-dependent.
  const newOrg = await prisma.organization.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      organizationProjects: true,
    },
  });
  return newOrg;
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
    return CreateError(400, `ID ${orgId} is not a number!!`, res);
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
