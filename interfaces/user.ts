import Joi from 'joi';
import { User } from '@prisma/client';

export type SanitizedUser = Omit<User, 'hashedPassword'>;

const schema = Joi.object({
  firstName: Joi.string()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('First name is required.')),
  lastName: Joi.string()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('Last name is required.')),
  role: Joi.string()
    .valid('admin', 'moderator', 'organization')
    .error(new Error('Valid role required.')),
  email: Joi.string()
    .email() // Not sure what parameters to use here, if at all. Should be ok with default email requirements.
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
