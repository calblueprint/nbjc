import Joi from 'joi';
import { User } from '@prisma/client';

export type SanitizedUser = Omit<User, 'hashedPassword'>;

export type SessionUser = {
  id: number;
  email: string;
  role: 'organization' | 'moderator' | 'admin' | null;
};

export type Session = {
  user: SessionUser;
  accessToken?: string;
  expires: string;
};

const schema = Joi.object({
  role: Joi.string()
    .valid('admin', 'moderator', 'organization')
    .error(new Error('Valid role required.')),
  email: Joi.string()
    .email()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('Valid email required.')),
  emailVerified: Joi.date().error(new Error('Email verified error.')),
  image: Joi.string().error(new Error('Image error.')),
  password: Joi.string()
    .min(6)
    .max(50)
    // eslint-disable-next-line no-useless-escape
    .pattern(/^[a-zA-Z0-9\s!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]+$/)
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .error(new Error('Your password is not strong enough.')),
});

export default schema;
