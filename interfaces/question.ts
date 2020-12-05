import Joi from 'joi';

export const QuestionSchema = Joi.object({
  question: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  hint: Joi.string(),
  placeholder: Joi.string(),
  required: Joi.boolean(),
  wordLimit: Joi.number(),
});

export const ResponseSchema = Joi.object({
  answer: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  questionId: Joi.number().when('$strict', { is: true, then: Joi.required() }),
  organizationId: Joi.number().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
});
