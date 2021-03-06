import Joi from 'joi';

export const AppQuestionSchema = Joi.object({
  question: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  hint: Joi.string().empty('').default(null),
  placeholder: Joi.string().empty('').default(null),
  required: Joi.boolean().empty('').default(null),
  wordLimit: Joi.number().allow(null),
});

export const AppResponseSchema = Joi.object({
  answer: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  questionId: Joi.number().when('$strict', { is: true, then: Joi.required() }),
  organizationId: Joi.number().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
});
