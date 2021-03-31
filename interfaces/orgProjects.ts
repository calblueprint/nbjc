import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  description: Joi.string().empty(''),
  organizationId: Joi.number()
    .integer()
    .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
