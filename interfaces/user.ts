import Joi from 'joi';

const schema = Joi.object({
  firstName: Joi.string()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('First name is required.')),
  lastName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  // .error(new Error('Last name is required.')),
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
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .min(6)
    .when('$strict', {
      is: true,
      then: Joi.required(),
    }),
});

export default schema;
