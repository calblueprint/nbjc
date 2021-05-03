import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, PasswordResets } from '@prisma/client';
import Joi from 'joi';
import CreateError, { MethodNotAllowed } from 'utils/error';
import EmailNotifier from 'utils/notify';
import { NotificationType } from 'utils/notify/types';

const prisma = new PrismaClient();

export type ForgotPasswordDTO = {
  email: string;
};

export const forgotPassword = async (
  user: ForgotPasswordDTO
): Promise<PasswordResets | null> => {
  const resetUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!resetUser) {
    throw new Error(`No account found with email ${user.email}`);
  }

  const resetData = await prisma.passwordResets.create({
    data: {
      users: { connect: { email: user.email } },
    },
  });

  // Invalidate old reset codes
  await prisma.passwordResets.updateMany({
    data: { valid: false },
    where: {
      createdAt: { lt: resetData.createdAt },
      valid: true,
    },
  });

  if (!resetData) {
    return null;
  }

  // Send email with reset code
  await EmailNotifier.sendNotification(NotificationType.ForgotPassword, {
    recipient: user.email,
    resetCode: resetData.id,
  });

  return resetData;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      return MethodNotAllowed(req.method, res);
    }

    const expectedBody = Joi.object({
      email: Joi.string().email().required(),
    });

    const { value, error } = expectedBody.validate(req.body);

    if (error) {
      return CreateError(400, error.message, res);
    }

    const body = value as ForgotPasswordDTO;

    const resetData = await forgotPassword(body);

    if (resetData) {
      return res.status(200).json(resetData);
    }
    return CreateError(400, 'Could not finish forgot password flow', res);
  } catch (err) {
    return CreateError(500, err.message, res);
  }
};

export default handler;
