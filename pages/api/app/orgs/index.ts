import prisma from 'utils/prisma';
import { OrganizationProject, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import { Project, ExistingProject, QnR } from 'interfaces/registration';
import CreateError, { MethodNotAllowed } from 'utils/error';
import parseValidationError from 'utils/parseValidationError';
import Joi from 'joi';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const isSubmit = req.query.submitting === 'true';

  const {
    userEmail,
    userId,
    qnr,
    projects,
    projIDsToDelete,
    ...body
  } = req.body;
  if (Joi.number().validate(userId).error) {
    return CreateError(400, `ID ${userId} is not a number`, res);
  }

  const { error, value } = OrganizationSchema.validate(body, {
    abortEarly: false,
    context: {
      strict: isSubmit,
    },
  });
  if (error) {
    return CreateError(400, parseValidationError(error), res);
  }

  const appRes = qnr as QnR[];

  const applicationStatus = isSubmit ? 'submitted' : 'draft';
  const active = isSubmit ? false : undefined;

  // Constructing lat long coordinates from inputted address
  let lat;
  let long;
  if (value.address) {
    const address = encodeURI(value.address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
    const json = await (await fetch(url)).json();
    // Best guess for location is first result, but perhaps it is also not correct.
    [long, lat] = json.features[0].geometry.coordinates;
  }

  const data = {
    lat,
    long,
    ...value,
    applicationStatus,
    active,
  } as Prisma.OrganizationCreateInput;

  const appProjs = projects as Project[];

  //* ** Splitting appProjs into create, update, and delete ***//

  // New projects are the ones without IDs yet.
  const toCreate = appProjs.filter((i) => !i.id);

  // Deleted projects are the projects in the DB that aren't passed into the API req.
  const currOrg = await prisma.organization.findUnique({
    where: { userId },
    include: { organizationProjects: true },
  });
  let toDelete: number[] = [];
  if (currOrg) {
    const currProjIds = new Set(
      appProjs.filter(({ id }) => !!id).map((p) => p.id)
    );
    const DBProjs = currOrg.organizationProjects;
    // By filtering the DB projects for projects that aren't in the current projects ids passed into the API,
    // we know that it was deleted in the registration form.
    toDelete = DBProjs.filter((p) => !currProjIds.has(p.id)).map((p) => p.id);
  }

  // Updated projects are the remaining projects. There aren't necessarily changed,
  // but making the PATCH request for projects that aren't modified won't change anything.
  const currProjs = appProjs.filter(({ id }) => !!id) as ExistingProject[];
  let toUpdate;
  if (currOrg) {
    toUpdate = currProjs.filter((p) => !new Set(toDelete).has(p.id));
  }

  // ***
  // CREATING THE REQUEST FOR ORG, PROJECTS, AND QnRs.
  // ***
  let newChanges;
  try {
    newChanges = await prisma.organization.upsert({
      where: {
        userId,
      },
      include: {
        organizationProjects: true,
      },
      create: {
        ...data,
        applicationResponses: {
          create: appRes.map(({ questionId, response: answer }) => ({
            answer,
            applicationQuestion: {
              connect: {
                id: questionId,
              },
            },
          })),
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },

      update: {
        ...data,
        organizationProjects: {
          updateMany: toUpdate?.map(({ id, title, description }) => ({
            where: {
              id,
            },
            data: {
              title,
              description,
            },
          })),
          deleteMany: toDelete.map((id) => ({ id })),
        },
        applicationResponses: {
          updateMany: appRes.map(({ questionId, response: answer }) => ({
            where: {
              questionId,
            },
            data: {
              answer,
            },
          })),
        },
      },
    });
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create organization', res);
  }

  // FIXME: This is a temporary (ugly) solution for creating projects
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
    return CreateError(500, 'Failed to create project', res);
  }

  // Getting all the projects in the DB now and sending it to front-end for projects attribute to become server-dependent.
  const newOrg = await prisma.organization.findUnique({
    where: {
      userId,
    },
    include: {
      organizationProjects: true,
    },
  });

  return res.json({ newOrg });
};
