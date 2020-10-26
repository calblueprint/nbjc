import { PrismaClient, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeUser from 'utils/sanitizeUser';
import UserSchema from 'interfaces/user';
import CreateError, { MethodNotAllowed } from 'utils/error';
import hash from 'utils/hashPassword';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Index is only for POST request
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  // Construct payload
  const registerInfo = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    hashed_password: hash(req.body.password), // I'm not sure why this has to be lowercase here
  };

  // Validating the structure for the request
  const { error, value } = UserSchema.validate(registerInfo, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  // Constructing new user
  try {
    const newUser = await prisma.user.create({
      data: registerInfo,
    });
    return res.json(sanitizeUser(newUser));
  } catch (err) {
    return CreateError(500, 'Failed to create user due to repeated email', res); // This is temporarily the only error I can think of to reach this point for
  }
};
