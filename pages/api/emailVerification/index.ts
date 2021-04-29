import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { EmailVerification } from '@prisma/client';
import EmailNotifier from 'utils/notify';
import CreateError, { MethodNotAllowed } from 'utils/error';
import { NotificationType } from 'utils/notify/types';
import prisma from 'utils/prisma';

export type EmailVerificationDTO = {
    email: string;    
}

const generateEmailVerification = async (
    user: EmailVerificationDTO
) : Promise<EmailVerification | null> => {
    const userRecord = await prisma.user.findUnique({
        where: { email: user.email}
    });

    if (!userRecord) {
        throw new Error(`No account found with email: ${user.email}`);
    }

    const verificationRequest = await prisma.emailVerification.create({
        data: {
            users: { connect: { email: user.email}},
        }
    });

    // Invalidate old verification requests
    await prisma.emailVerification.updateMany({
        data: {valid: false},
        where: {
            createdAt: { lt: verificationRequest.createdAt},
            valid: true
        }
    });

    if (!verificationRequest) {
        return null;
    }

    // Send Email!
    await EmailNotifier.sendNotification(NotificationType.VerificationLink, {
        recipient: user.email,
        verificationCode: verificationRequest.id,
    });

    return verificationRequest;
}

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse
) : Promise<void> => {
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

        const body = value as EmailVerificationDTO;
        const verificationData = await generateEmailVerification(body);

        if (verificationData) {
            res.status(200).json(verificationData);
        } else {
            return CreateError(400, 'Failed to generate email verification data', res);
        }
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default handler;