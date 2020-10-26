import Joi from 'joi';

const schema = Joi.object({
  first_name: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  last_name: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  role: Joi.string(),
  email: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  emailVerified: Joi.date(),
  image: Joi.string(),
  hashed_password: Joi.string(),
}); // .when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
