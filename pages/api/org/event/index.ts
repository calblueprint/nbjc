import prisma from 'utils/prisma';
import { OrganizationEvent } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import EventSchema from 'interfaces/event';
import CreateError, { MethodNotAllowed } from 'utils/error';

export const getAllEvents = async (): Promise<OrganizationEvent[] | null> => {
  const events = await prisma.organizationEvent.findMany();
  return events;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  // should the context be strict: true?
  const { error, value } = EventSchema.validate(req.body, {
    context: { strict: false },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as OrganizationEvent;

  // line 36, should organizations be singular? it won't let me make it so.
  try {
    const newEvent = await prisma.organizationEvent.create({
      data: {
        title: data.title,
        description: data.description,
        lgbtqDemographic: data.lgbtqDemographic,
        ageDemographic: data.ageDemographic,
        raceDemographic: data.raceDemographic,
        link: data.link,
        address: data.address,
        organizations: {
          connect: { id: data.organizationId },
        },
        startDatetime: data.startDatetime,
        endDatetime: data.endDatetime,
      },
    });
    return res.json(newEvent);
  } catch (err) {
    return CreateError(500, 'Failed to create event', res);
  }
};
