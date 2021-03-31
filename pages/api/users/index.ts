import prisma from 'utils/prisma';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeUser from 'utils/sanitizeUser';
import UserSchema from 'interfaces/user';
import CreateError, { MethodNotAllowed } from 'utils/error';
import hash from 'utils/hashPassword';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Index is only for POST request
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  // Validating the structure for the request
  const { error, value } = UserSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  // Hashing password
  value.hashedPassword = hash(value.password);
  delete value.password;

  // Casting value as a User
  const data = value as User;

  try {
    const newUser = await prisma.user.create({
      data,
    });
    return res.json(sanitizeUser(newUser));
  } catch (err) {
    if (err.code === 'P2002') {
      if (err.meta.target.includes('email')) {
        return CreateError(
          500,
          'Failed to create user due to duplicate email',
          res,
          'DUP_EMAIL'
        );
      }
    }
    return CreateError(500, 'Failed to create user', res);
  }
};
