import { Prisma, Organization } from '@prisma/client';
import Joi from 'joi';

export type Project = {
  id?: number;
  title: string;
  description: string;
};

export type Response = {
  id: number[];
  response: string[];
};

export type AppQnR =
  | Prisma.ApplicationQuestionGetPayload<{
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
  short1: string;
  short2: string;
  short3: string;
  projects: Project[];
  qnr: QnR[];
  // proj1: string;
  // proj2: string;
  // proj3: string;
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
    .uri({ domain: { tlds: false }, allowRelative: true })
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
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({ 'string.pattern.base': 'Not a valid EIN' }),
  // foundingDate: Joi.date(),
  is501c3: Joi.boolean(),
  projects: Joi.array()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'project is required',
    }),
  short1: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'short1 is required',
    }),
  short2: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  short3: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
