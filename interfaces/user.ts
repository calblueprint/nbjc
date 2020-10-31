import Joi from 'joi';

const schema = Joi.object({
  firstName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  lastName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  role: Joi.string().valid('admin', 'moderator', 'organization'),
  email: Joi.string()
    .email() // Not sure what parameters to use here, if at all. Should be ok with default email requirements.
    .when('$strict', { is: true, then: Joi.required() }),
  emailVerified: Joi.date(),
  image: Joi.string(),
  hashedPassword: Joi.string().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
});

export default schema;
