import prisma from 'utils/prisma';
import { Organization, OrganizationProject } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import CreateError, { MethodNotAllowed } from 'utils/error';
import parseValidationError from 'utils/parseValidationError';
import Joi from 'joi';
import { QnR } from 'interfaces/registration';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const isSubmit = req.query.submitting === 'true';

  const { userId, qnr, projects, ...body } = req.body;
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
  const appProjs = projects as OrganizationProject[];

  const applicationStatus = isSubmit ? 'submitted' : 'draft';
  const active = isSubmit ? false : undefined;
  const data = { ...value, applicationStatus, active } as Organization;

  try {
    const newOrg = await prisma.organization.upsert({
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
        organizationProjects: {
          create: appProjs.map(({ title, description }) => ({
            title,
            description,
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
        organizationProjects: {
          create: [], // iterate through list of projects to create
          update: [], // iterate through list of projects to update
          deleteMany: [], // iterate through list of projects to delete
        },
      },
    });
    return res.json(newOrg);
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create organization', res);
  }
};
