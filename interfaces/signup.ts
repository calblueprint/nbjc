import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Not a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string().min(1).messages({
    'string.pattern.base':
      'Password must be at least 8 characters and contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character.',
  }),
  confirmPassword: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match.',
  }),
});

export default schema;
