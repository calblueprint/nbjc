import { PrismaClient, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeUser from 'utils/sanitizeUser';
import UserSchema from 'interfaces/user';
import CreateError, { MethodNotAllowed } from 'utils/error';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const { error, value } = UserSchema.validate(req.body, {
    context: { strict: true },
  });
  if (error) {
    return CreateError(400, error.message, res);
  }

  const data = value as User;

  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        hashedPassword: data.hashedPassword,
      },
    });
    return res.json(sanitizeUser(newUser));
  } catch (err) {
    return CreateError(500, 'Failed to create user', res);
  }
};
