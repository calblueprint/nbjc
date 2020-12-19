import prisma from 'utils/prisma';
import { User } from '@prisma/client';
import Joi, { ValidationError } from 'joi';

import { NextApiRequest, NextApiResponse } from 'next';
import UserSchema, { SanitizedUser } from 'interfaces/user';
import CreateError, { MethodNotAllowed } from 'utils/error';
import sanitizeUser from 'utils/sanitizeUser';

const schema = Joi.object({
  oldEmail: Joi.string().required().email(),
  email: Joi.string().required().email(),
});

type emailType = {
  oldEmail: string;
  email: string;
};

// Main method
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'PATCH') {
    return MethodNotAllowed(req.method, res);
  }

  const { newEmail } = req.body;

  if (Joi.string().email().validate(newEmail).error) {
    return CreateError(400, `Email ${newEmail} is not a valid email`, res);
  }

  const { error, value } = schema.validate(req.body);
  if (error) {
    return CreateError(400, error.message, res);
  }

  const emails = value as emailType;

  try {
    // TODO: change to use user id instead of email
    const updatedUser = await prisma.user.update({
      where: { email: emails.oldEmail },
      data: { email: emails.email },
    });
    return res.json(sanitizeUser(updatedUser));
  } catch (err) {
    if (err instanceof ValidationError) {
      return CreateError(400, err.message, res);
    }
    return CreateError(
      500,
      `Failed to patch user with email ${emails.oldEmail}`,
      res
    );
  }
};
