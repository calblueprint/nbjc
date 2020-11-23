import Joi from 'joi';

const schema = Joi.object({
  answer: Joi.string(),
  questionId: Joi.number(),
  organizationId: Joi.number().required(),
});

export default schema;
