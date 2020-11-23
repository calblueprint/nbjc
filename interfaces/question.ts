import Joi from 'joi';

const schema = Joi.object({
  question: Joi.string(),
  hint: Joi.string(),
  placeholder: Joi.string(),
  required: Joi.boolean(),
  wordLimit: Joi.number(),
});

export default schema;
