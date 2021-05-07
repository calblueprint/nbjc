import prisma from 'utils/prisma';
import { User } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import UserSchema, { SanitizedUser } from 'interfaces/user';
import CreateError, { MethodNotAllowed } from 'utils/error';
import sanitizeUser from 'utils/sanitizeUser';

/**
 * Retrieve a User by its ID
 * @param id - the ID of the User
 */
export const getUser = async (id: string): Promise<SanitizedUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (user) {
    return sanitizeUser(user);
  }
  return null;
};

/**
 * Update an User by the given ID and fields and return the updated User
 * @param id - the ID of the User
 * @param body - the fields of the User to update
 */
export const updateUser = async (
  id: string,
  body: User
): Promise<User | null> => {
  const { error, value } = UserSchema.validate(body);
  if (error) {
    throw error;
  }

  const data = value as User;

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      role: data.role,
      email: data.email,
      emailVerified: data.emailVerified,
      image: data.image,
    },
  });
  return updatedUser;
};

/**
 * Delete the User by the given ID
 * @param id - the ID of the User
 */
export const deleteUser = async (id: string): Promise<User | null> => {
  await prisma.user.update({
    where: { id: Number(id) },
    data: {
      organization: {
        disconnect: true,
      },
    },
  });
  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
    include: { organization: true },
  });
  return deletedUser;
};

// Main method
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const userId = req.query.id as string;

  if (Joi.number().validate(userId).error) {
    return CreateError(400, `ID ${userId} is not a number`, res);
  }

  if (req.method === 'GET') {
    try {
      const user = await getUser(userId);
      if (!user) {
        res.status(204);
      }

      return res.json(user);
    } catch (err) {
      return CreateError(500, `Failed to get user ${userId}`, res);
    }
  }
  if (req.method === 'PATCH') {
    try {
      const response = await updateUser(userId, req.body);
      return res.json(response);
    } catch (err) {
      if (err instanceof ValidationError) {
        return CreateError(400, err.message, res);
      }
      return CreateError(500, `Failed to patch user ${userId}`, res);
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedUser = await deleteUser(userId);
      return res.json(deletedUser);
    } catch (err) {
      return CreateError(500, `Failed to delete user ${userId}`, res);
    }
  }
  return MethodNotAllowed(req.method, res);
};
