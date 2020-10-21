import Joi from 'joi';

const schema = Joi.object({
  firstName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  lastName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  role: Joi.string(),
  email: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  emailVerified: Joi.date(),
  image: Joi.string(),
  hashedPassword: Joi.string(),
}); // .when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
