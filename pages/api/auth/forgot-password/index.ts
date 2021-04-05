import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import { SanitizedUser } from 'interfaces/user';
import Joi from 'joi';

const prisma = new PrismaClient();

type NewPasswordDTO = {
    resetCode:   string,
    newPassword: string,
}

export const resetPassword = async(
    body: NewPasswordDTO
): Promise<SanitizedUser | null> => {
    if(Joi.string().uuid({ version: "uuidv4" }).validate(body.resetCode).error) {
        throw new Error("Invalid Reset Code");
    }
    
    return null;
}

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
) : Promise<void> => {
    const expectedBody = Joi.object({
        resetCode:   Joi.string().required(),
        newPassword: Joi.string().required(),
    });

    const { value, error } = expectedBody.validate(req.body);

    if (error) {
        throw new Error(error.message);
    }

    const body = value as NewPasswordDTO;
};

export default handler;