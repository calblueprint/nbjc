import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  long: Joi.number(),
  lat: Joi.number(),
  type: Joi.string().allow(''),
}).when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
