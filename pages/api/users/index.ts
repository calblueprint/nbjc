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
  const registerInfo = req.body;
  registerInfo.hashedPassword = hash(registerInfo.password);
  delete registerInfo.password;

  // Validating the structure for the request
  const { error, value } = UserSchema.validate(registerInfo, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as User;

  // Constructing new user
  try {
    const newUser = await prisma.user.create({
      data,
    });
    return res.json(sanitizeUser(newUser));
  } catch (err) {
    return CreateError(
      500,
      'Failed to create user due to duplicate email',
      res
    ); // This is temporarily the only error I can think of that can reach this point in production.
  }
};
