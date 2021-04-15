import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, password_resets} from "@prisma/client";
import { SanitizedUser } from 'interfaces/user';
import Joi from 'joi';
import hashPassword from 'utils/hashPassword';
import sanitizeUser from "utils/sanitizeUser";

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
        throw new Error('Reset Code Used/Expired');
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
            throw new Error(error.message);
        }
    
        const body = value as NewPasswordDTO;
        const updatedUserData = await resetPassword(body);
        if (updatedUserData) {
            res.status(200).json(updatedUserData);
        } else {
            res.status(404).json({
                statusCode: 404,
                message: "Failed to reset password",
            });
        }
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message:    err.message,
        })
    }
};

export default handler;