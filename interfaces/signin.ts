import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Not a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string().min(6).max(50).messages({
    'string.empty': 'Password is required.',
  }),
});

export default schema;
