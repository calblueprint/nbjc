import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import CreateError, { MethodNotAllowed } from 'utils/error';
import prisma from 'utils/prisma';
import sanitizeUser from 'utils/sanitizeUser';
import { SanitizedUser } from 'interfaces/user';

export type VerificationRequestDTO = {
    verificationCode: string;
}

const validateCode = async (
    request: VerificationRequestDTO
) : Promise<SanitizedUser> => {
    if (Joi.string().uuid({ version: 'uuidv4'}).validate(request.verificationCode).error) {
        throw new Error('Invalid Email Verification Code');
    }

    const verificationRecord = await prisma.emailVerification.findUnique({
        where: { id: request.verificationCode},
    });

    if (!verificationRecord) {
        throw new Error('Invalid Email Verification Code');
    }

    if (!verificationRecord) {
        throw new Error('Email Verification Link has expired or been used');
    }

    // update record
    const updatedVerificationRecord = await prisma.emailVerification.update({
        data: { valid: false },
        where: { id: verificationRecord.id}
    });

    if (!verificationRecord) {
        throw new Error('Verification Update Failed');
    }

    // update user
    const updatedUserRecord = await prisma.user.update({
        data: { emailVerified: String(Date.now())},
        where: { id: updatedVerificationRecord.userId}
    });

    if (!updatedUserRecord) {
        throw new Error('Could not verify user\'s email');
    }

    return sanitizeUser(updatedUserRecord);
};

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
) : Promise<void> => {
    try {
        const expectedBody = Joi.object({
            verificationCode: Joi.string().required()
        });
    
        const { value, error } = expectedBody.validate(req.body);
        if (error) {
            return CreateError(400, error.message, res);
        }

        const body = value as VerificationRequestDTO;
        const updatedUser = await validateCode(body);
        if (updatedUser) {
            return res.status(200).json(updatedUser);
        }
        return CreateError(404, 'Failed to verify email', res);
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default handler;