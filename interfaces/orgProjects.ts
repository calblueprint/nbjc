import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('Title is required.')),
  description: Joi.string()
    .when('$strict', { is: true, then: Joi.required() })
    .error(new Error('Description is required.')),
  organizationId: Joi.number().error(new Error('Organization ID is required.')),
});

export default schema;
