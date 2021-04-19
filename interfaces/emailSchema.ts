import Joi from 'joi';

export default const EmailSchema = Joi.object({
    emailSubject: Joi.string()
    .required()
    .messages({
        'string.empty' : 'Subject is required'
    }),
    recipient: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Not a valid email address.',
      'string.empty': 'Email is required.',
    }),
    content: Joi
    .string()
    .required()
    .messages({
        'string.empty' : 'Email body/content cannot be empty'
    }),
});