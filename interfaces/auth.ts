import Joi from 'joi';

export const signinSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Not a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
  }),
});

export const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Not a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string().min(6).max(50).messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters.',
    'string.max': 'Password must be 50 characters or fewer.',
  }),
  confirmPassword: Joi.valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match.',
  }),
});
