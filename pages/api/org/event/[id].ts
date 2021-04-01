import prisma from 'utils/prisma';
import { OrganizationEvent } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import EventSchema from 'interfaces/event';
import CreateError, { MethodNotAllowed } from 'utils/error';

/**
 * Retrieve an Event by its ID
 * @param id - the ID of the Event
 */
export const getEvent = async (
  id: string
): Promise<OrganizationEvent | null> => {
  const org = await prisma.organizationEvent.findOne({
    where: { id: Number(id) },
  });
  return org;
};

/**
 * Update an Event by the given ID and fields and return the updated Event
 * @param id - the ID of the Event
 * @param body - the fields of the Event to update
 */
export const updateEvent = async (
  id: string,
  body: OrganizationEvent
): Promise<OrganizationEvent | null> => {
  const { error, value } = EventSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as OrganizationEvent;

  const updatedEvent = await prisma.organizationEvent.update({
    where: { id: Number(id) },
    data,
  });
  return updatedEvent;
};

/**
 * Delete the Event by the given ID
 * @param id - the ID of the Event
 */
export const deleteEvent = async (
  id: string
): Promise<OrganizationEvent | null> => {
  const deletedEvent = await prisma.organizationEvent.delete({
    where: { id: Number(id) },
  });
  return deletedEvent;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const eventId = req.query.id as string;

  if (Joi.number().validate(eventId).error) {
    return CreateError(400, `ID ${eventId} is not a number`, res);
  }

  if (req.method === 'GET') {
    try {
      const org = await getEvent(eventId);

      if (!org) {
        res.status(204);
      }

      return res.json(org);
    } catch (err) {
      return CreateError(500, `Failed to get event ${eventId}`, res);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const response = await updateEvent(eventId, req.body);
      return res.json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        return CreateError(400, err.message, res);
      }
      return CreateError(500, `Failed to patch event ${eventId}`, res);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedEvent = await deleteEvent(eventId);
      return res.json(deletedEvent);
    } catch (err) {
      return CreateError(500, `Failed to delete event ${eventId}`, res);
    }
  }
  return MethodNotAllowed(req.method, res);
};
