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
    'string.pattern.base': 'Password must be between 6 and 50 characters.',
  }),
  confirmPassword: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match.',
  }),
});

export default schema;
