import { ApplicationQuestionGetPayload, Organization } from '@prisma/client';
import Joi from 'joi';

export type Response = {
  id: number[];
  response: string[];
};

export type AppQnR =
  | ApplicationQuestionGetPayload<{
      select: {
        id: true;
        placeholder: true;
        question: true;
        hint: true;
        required: true;
        wordLimit: true;
        applicationResponses: {
          select: {
            answer: true;
          };
        };
      };
    }>[]
  | null;

export type QnR = { questionId: number; response: string };

export type Form = Pick<
  Organization,
  | 'name'
  | 'contactName'
  | 'contactEmail'
  | 'contactPhone'
  | 'website'
  | 'address'
  | 'missionStatement'
  | 'shortHistory'
  | 'lgbtqDemographic'
  | 'raceDemographic'
  | 'ageDemographic'
  | 'ein'
  | 'is501c3'
> & {
  organizationType: string;
  workType: string;
  qnr: QnR[];
  proj1: string;
  proj2: string;
  proj3: string;
  // capacity: number | undefined;
  // foundingDate: Date | undefined;
};

const schema = Joi.object({
  name: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Organization Name is required',
    }),
  contactName: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Contact Name is required',
    }),
  contactEmail: Joi.string()
    .empty('')
    .email({ tlds: { allow: false } })
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Contact Email is required',
    }),
  contactPhone: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Contact Phone is required',
    }),
  organizationType: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({ 'any.required': 'Type of Organization is required' }),
  workType: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({ 'any.required': 'Type of Work is required' }),
  website: Joi.string()
    .empty('')
    .uri({ domain: { tlds: false } })
    .messages({
      'string.uri':
        'Not a valid URL - remember http or https (https://nbjc.org)',
      'string.domain': 'Not a valid URL - missing domain (https://nbjc.org)',
    }),
  // locationType: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() })
  //   .messages({ 'any.required': 'Location Type is required' }),
  address: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'Address is required',
    }),
  missionStatement: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Description and Mission is required',
    }),
  shortHistory: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'History is required',
    }),
  lgbtqDemographic: Joi.array()
    .unique()
    .items(Joi.string())
    .when('$strict', { is: true, then: Joi.required() }),
  raceDemographic: Joi.array()
    .unique()
    .items(Joi.string())
    .when('$strict', { is: true, then: Joi.required() }),
  ageDemographic: Joi.array()
    .unique()
    .items(Joi.string())
    .when('$strict', { is: true, then: Joi.required() }),
  // capacity: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() }),
  ein: Joi.string()
    .empty('')
    .pattern(/^[0-9]\d?-?\d{7}$/)
    .messages({ 'string.pattern.base': 'Not a valid EIN' }),
  // foundingDate: Joi.date(),
  is501c3: Joi.boolean(),
  proj1: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  proj2: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  proj3: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
