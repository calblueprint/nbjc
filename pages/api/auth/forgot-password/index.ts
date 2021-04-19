import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, password_resets } from "@prisma/client";
import Joi from 'joi';
import CreateError, { MethodNotAllowed } from 'utils/error';
import sendEmail from 'utils/sendEmail';

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
    
    // TO-DO Format Email body, update resetUrl
    const resetUrl = `http://localhost:3000/users/reset-password/${resetData.id}`;
    await sendEmail('[NBJC] Password Reset Link', user.email, resetUrl);

    return resetData;
}

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
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
    
        const body = value as ForgotPasswordDTO;
    
        const resetData = await forgotPassword(body);
        
        if (resetData) {
            return res.status(200).json(resetData);
        } else {
            return CreateError(400, 'Could not finish forgot password flow', res);
        }
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default handler;