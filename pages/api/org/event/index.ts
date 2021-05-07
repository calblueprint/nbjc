import prisma from 'utils/prisma';
import { OrganizationEvent } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import EventSchema, { NewEvent } from 'interfaces/event';
import CreateError, { MethodNotAllowed } from 'utils/error';
import SplitObjs from 'utils/splitObjs';
import Joi from 'joi';

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
  // We will be doing a complete upsert for all the events here.
  const eventValidation = Joi.array().items(EventSchema);
  const { error, value } = eventValidation.validate(req.body.events, {
    context: { strict: false },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const events = value as NewEvent[];

  // Splitting objects into create, update, and delete
  const currEvents = await prisma.organizationEvent.findMany({
    where: {
      organizationId: req.body.organizationId,
    },
  });
  const [toCreate, toUpdate, toDelete] = SplitObjs<NewEvent, OrganizationEvent>(
    events,
    currEvents
  );

  // ***
  // CREATING THE REQUESTS FOR CREATEMANY, UPDATEMANY, AND DELETEMANY
  // ***
  let newChanges;
  try {
    if (toCreate) {
      for (let i = 0; i < toCreate.length; i += 1) {
        const created = prisma.organizationEvent.create({
          data: toCreate[i],
        });
      }
    }
    if (toUpdate) {
      const updatedMany = prisma.organizationEvent.updateMany({
        data: toUpdate,
      });
    }
    if (toDelete) {
      const deleteMany = prisma.organizationEvent.deleteMany({
        where: {
          id: {
            in: toDelete,
          },
        },
      });
    }
  } catch (err) {
    return CreateError(
      500,
      'Failed to save changes to organization events.',
      res
    );
  }

  // Return the organization events for the organization.
  const finalEvents = await prisma.organizationEvent.findMany({
    where: {
      organizationId: req.body.organizationId,
    },
  });
  return res.json({ finalEvents });
};
