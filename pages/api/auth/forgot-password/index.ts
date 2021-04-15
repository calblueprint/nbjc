import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, password_resets } from "@prisma/client";
import Joi from 'joi';

const prisma = new PrismaClient();

export type ForgotPasswordDTO = {
    email: string,
};

export const forgotPassword = async(
    user: ForgotPasswordDTO
): Promise<password_resets | null> => {

    const resetUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (!resetUser) {
        throw new Error(`No account found with email ${user.email}`);
    }

    const resetData = await prisma.password_resets.create({
        data: {
            users: { connect: {email: user.email} },
        }
    });

    // Invalidate old reset codes
    await prisma.password_resets.updateMany({
        data: {valid: false},
        where: {created_at: {lt: resetData.created_at}}
    });

    if (!resetData) {
        return null;
    }
    
    // TO-DO send email notification, etc.
    
    return resetData;
}

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
) : Promise<void> => {
    try {
        const expectedBody = Joi.object({
            email: Joi.string().email().required(),
        });
    
        const { value, error } = expectedBody.validate(req.body);
    
        if (error) {
            throw new Error(error.message);
        }
    
        const body = value as ForgotPasswordDTO;
    
        const resetData = await forgotPassword(body);
        
        if (resetData) {
            res.status(200).json(resetData);
        } else {
            res.status(404).json({
                statusCode: 404,
                message:    "Could not initiate forgot password process",
            })
        }
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message:    err.message,
        });
    }
};

export default handler;