import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import OrganizationSchema, {
  Project,
  ExistingProject,
} from 'interfaces/organization';
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
    console.log('errr', error);
    throw error;
  }

  const { organizationProjects, ...data } = value;
  const dataTyped = data as Organization;
  const orgProjects = organizationProjects as Project[];

  // same logic as registration, generalize logic later.
  //* ** Splitting appProjs into create, update, and delete ***//

  // New projects are the ones without IDs yet.
  const toCreate = orgProjects.filter((i) => !i.id);

  // Deleted projects are the projects in the DB that aren't passed into the API req.
  const currOrg = await prisma.organization.findUnique({
    where: { id: Number(id) },
    include: { organizationProjects: true },
  });
  let toDelete: number[] = [];
  if (currOrg) {
    const currProjIds = new Set(
      orgProjects.filter(({ id: projId }) => !!projId).map((p) => p.id)
    );
    const DBProjs = currOrg.organizationProjects;
    // By filtering the DB projects for projects that aren't in the current projects ids passed into the API,
    // we know that it was deleted in the registration form.
    toDelete = DBProjs.filter((p) => !currProjIds.has(p.id)).map((p) => p.id);
  }

  // Updated projects are the remaining projects. There aren't necessarily changed,
  // but making the PATCH request for projects that aren't modified won't change anything.
  const currProjs = orgProjects.filter(
    ({ id: projId }) => !!projId
  ) as ExistingProject[];
  let toUpdate;
  if (currOrg) {
    toUpdate = currProjs.filter((p) => !new Set(toDelete).has(p.id));
  }

  console.log(toCreate);
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
          deleteMany: toDelete.map((projId) => ({ id: projId })),
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
      console.log('hi');
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
  orgId: string
): Promise<Organization | null> => {
  const id = Number(orgId);
  await prisma.applicationNote.deleteMany({
    where: { organizationId: id },
  });
  await prisma.applicationResponse.deleteMany({
    where: { organization: { id } },
  });
  await prisma.organizationEvent.deleteMany({
    where: { organization: { id } },
  });
  await prisma.organizationProject.deleteMany({
    where: { organization: { id } },
  });
  await prisma.organizationApplicationReview.deleteMany({
    where: { organization: { id } },
  });
  await prisma.organization.update({
    where: { id: Number(id) },
    data: {
      user: {
        disconnect: true,
      },
    },
  });
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
      return CreateError(
        500,
        `Failed to delete organization ${orgId}, ${err.message}`,
        res
      );
    }
  }
  return MethodNotAllowed(req.method, res);
};
