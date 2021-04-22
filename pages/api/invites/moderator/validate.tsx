import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import CreateError, { MethodNotAllowed } from 'utils/error';

const prisma = new PrismaClient();

export type ModeratorInviteInfo = {
    modInvite: string,
    email:     string,
};

// Performs validation and invalidates the invite code
const validate = async (
    req: NextApiRequest,
    res: NextApiResponse,
) : Promise<void> => {
    try {
        if (req.method !== 'POST') {
            return MethodNotAllowed(req.method, res);
        }

        const expectedBody = Joi.object({
            modInvite: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
                'string.guid' : 'Invalid invite code'
            }),
            email: Joi.string().email().required()
        });
    
        const { value, error } = expectedBody.validate(req.body);
    
        if (error) {
            return CreateError(400, error.message, res);
        }
    
        const body = value as ModeratorInviteInfo;
        const inviteRecord = await prisma.moderatorInvite.findUnique({
            where: {id: body.modInvite}
        });
    
        if (!inviteRecord || !inviteRecord.valid) {
            return CreateError(400, "Invalid moderator invite code", res);
        }
    
        if (inviteRecord.email !== body.email) {
            return CreateError(400, `The email ${body.email} is not linked to this invite code`, res);
        }
    
        await prisma.moderatorInvite.update({
            where: {id: body.modInvite},
            data:  {valid: false},
        })

        return res.status(200).json(JSON.stringify({
            ok: true
        }));
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};

export default validate;