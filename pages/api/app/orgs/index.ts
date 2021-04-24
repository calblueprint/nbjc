import prisma from 'utils/prisma';
import { OrganizationProject, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import { Project, QnR } from 'interfaces/registration';
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
  const address = encodeURI(value.address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
  const json = await (await fetch(url)).json();
  // Best guess for location is first result, but perhaps it is also not correct.
  const [long, lat] = json.features[0].geometry.coordinates;

  const data = {
    lat,
    long,
    ...value,
    applicationStatus,
    active,
  } as Prisma.OrganizationCreateInput;

  const appProjs = projects as Project[];
  const deleteProjs = projIDsToDelete as number[];
  console.log('delete ids', deleteProjs);
  const toUpdate = appProjs.filter(({ id }) => !!id); // projects to update
  const toCreate = appProjs.filter((i) => !i.id); // projects without id, to be created
  console.log('toupdate', toUpdate);
  console.log('tocreate', toCreate);

  // Get existing projects org has, compare w projects that have an ID that are passed into API, delete them if they're not there.
  // 1. Separate ones w and w/o ID
  // 2. Compare which ones to delete
  // 3. Run upsert to update and delete
  // 4. Create projects w loop
  let newOrg;
  try {
    newOrg = await prisma.organization.upsert({
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
          updateMany: toUpdate.map(({ id, title, description }) => ({
            where: {
              id,
            },
            data: {
              title,
              description,
            },
          })),
          deleteMany: deleteProjs.map((id) => ({ id })),
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

  // FIXME: This is a temporary solution to return all the projects that were created by the Save Changes in registration
  let createdProjs: OrganizationProject[] = [];

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
              id: newOrg.id,
            },
          },
        },
      });
      createdProjs.push(response);
    }
  } catch (err) {
    return CreateError(500, 'Failed to create project', res);
  }
  // Temp solution to registration multiple save changes issue, return projects only. May be better to put this logic in projects API instead.
  console.log(createdProjs);
  return res.json({ newOrg, createdProjs });
};
