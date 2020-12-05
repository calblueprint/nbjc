import Joi from 'joi';

export const AppQuestionSchema = Joi.object({
  question: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  hint: Joi.string(),
  placeholder: Joi.string(),
  required: Joi.boolean(),
  wordLimit: Joi.number(),
});

export const AppResponseSchema = Joi.object({
  answer: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  questionId: Joi.number().when('$strict', { is: true, then: Joi.required() }),
  organizationId: Joi.number().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
});
