import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, ModeratorInvite } from '@prisma/client';
import Joi from 'joi';
import CreateError, { MethodNotAllowed } from 'utils/error';
import EmailNotifier from 'utils/notify';
import { NotificationType } from 'utils/notify/types';

const prisma = new PrismaClient();

export type ModeratorInviteDTO = {
    email: string;
};

export const generateInviteCode = async (
    invited : ModeratorInviteDTO
) : Promise<ModeratorInvite | null> => {
    
    const existingUser = await prisma.user.findUnique({
        where: {email: invited.email},
    });

    if (existingUser) {
        throw new Error(`${invited.email} is already linked to an exisitng account.
        If you would like to send a moderator invite to this email, please have the
        owner delete their account first.`)
    }

    const newModeratorInvite = await prisma.moderatorInvite.create({
        data: { email: invited.email },
    });

    if (!newModeratorInvite) {
        throw new Error('Failed to create a moderator invite');
    }

    // invalidate old invite links
    await prisma.moderatorInvite.updateMany({
        where: {
            email: invited.email,
            valid: true,
            createdAt: {lt: newModeratorInvite.createdAt}
        },
        data: {
            valid: false,
        }
    });

    EmailNotifier.sendNotification(NotificationType.ModeratorInvite, {
        recipient: invited.email,
        inviteCode: newModeratorInvite.id,
    });

    return newModeratorInvite;
};

const handler = async (
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
    
        const body = value as ModeratorInviteDTO;
        const inviteData = await generateInviteCode(body);
    
        if (inviteData) {
            return res.status(200).json(inviteData);
        }
    
        return CreateError(400, 'Could not finish moderator invite creation flow', res);
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default handler;