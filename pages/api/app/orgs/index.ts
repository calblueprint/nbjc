import prisma from 'utils/prisma';
import { Prisma } from '@prisma/client';
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
  const data = {
    ...value,
    applicationStatus,
    active,
  } as Prisma.OrganizationCreateInput;

  const appProjs = projects as Project[];
  const deleteProjs = projIDsToDelete as number[];
  const toCreate = appProjs.filter(({ id }) => !!id); // projects without id, to be created
  const toUpdate = appProjs.filter((i) => !i.id); // projects to update
  let newOrg;
  try {
    newOrg = await prisma.organization.upsert({
      where: {
        userId,
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

  await prisma.organizationProject.deleteMany;

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
    }
  } catch (err) {
    return CreateError(500, 'Failed to create project', res);
  }

  return res.json(newOrg);
};
