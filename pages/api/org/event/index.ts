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
  let eventValidation = Joi.array().items(EventSchema);
  const { error, value } = eventValidation.validate(req.body.events, {
    context: { strict: false },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const events = value as OrganizationEvent[];

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
    // TODO: Make this API work.
  } catch (err) {
    console.log(err);
  }
};
