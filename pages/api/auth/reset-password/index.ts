import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient} from "@prisma/client";
import { SanitizedUser } from 'interfaces/user';
import Joi from 'joi';
import hashPassword from 'utils/hashPassword';
import sanitizeUser from "utils/sanitizeUser";
import CreateError, { MethodNotAllowed } from 'utils/error';

const prisma = new PrismaClient();

export type NewPasswordDTO = {
    resetCode:   string,
    newPassword: string,
}

export const resetPassword = async(
    body: NewPasswordDTO
): Promise<SanitizedUser> => {
    if(Joi.string().uuid({ version: "uuidv4" }).validate(body.resetCode).error) {
        throw new Error("Invalid Reset Code");
    }

    const resetData = await prisma.password_resets.findUnique({
        where: {id: body.resetCode},
    });

    if (!resetData) {
        throw new Error('Invalid Reset Code');
    }

    if (!resetData.valid) {
        throw new Error('Reset Link/Code has been used or is expired');
    }

    const updatedPasswordRecord = await prisma.password_resets.update({
        data:  {valid: false},
        where: {id: resetData.id},
    });

    if (!updatedPasswordRecord) {
        throw new Error('Could not update password');
    }

    const userRecord = await prisma.user.update({
        data: { hashedPassword: hashPassword(body.newPassword)},
        where: {id: updatedPasswordRecord.user_id},
    });

    if (!userRecord) {
        throw new Error('Could not update password');
    }
    
    return sanitizeUser(userRecord);
}

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
) : Promise<void> => {
    try {
        if (req.method != 'POST') {
            return MethodNotAllowed(req.method, res);
        }

        const expectedBody = Joi.object({
            resetCode:   Joi.string().required(),
            newPassword: Joi.string().min(6).max(50).required().messages({
                'string.empty': 'Password is required.',
                'string.min': 'Password must be at least 6 characters.',
                'string.max': 'Password must be 50 characters or fewer.',
              }),
        });
    
        const { value, error } = expectedBody.validate(req.body);
    
        if (error) {
            return CreateError(400, error.message, res);
        }
    
        const body = value as NewPasswordDTO;
        const updatedUserData = await resetPassword(body);
        if (updatedUserData) {
            return res.status(200).json(updatedUserData);
        } else {
            return CreateError(404, 'Failed to update password', res);
        }
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default handler;