import prisma from 'utils/prisma';
import { Prisma } from '@prisma/client';
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

  const { userId, qnr, ...body } = req.body;
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
      },
    });
    return res.json(newOrg);
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create organization', res);
  }
};
