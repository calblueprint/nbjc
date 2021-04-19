import { NextApiRequest, NextApiResponse } from 'next';
import sendEmail from 'utils/sendEmail';
import { EmailSchema } from 'interfaces/emailSchema';
import CreateError, { MethodNotAllowed } from 'utils/error';

export default async (req: NextApiRequest, res: NextApiResponse) : Promise<void> => {
    if (req.method !== 'POST') {
        return MethodNotAllowed(req.method, res);
    }

    const { value, error } = EmailSchema.validate(req.body);

    if (error) {
        return CreateError(400, error.message, res);
    }

    const { emailSubject, recipient, content } = value;
    
    try {
        const email = await sendEmail(emailSubject, recipient, content);
        return res.json(email);
    } catch (err) {
        return CreateError(500, err.message, res);
    }
};