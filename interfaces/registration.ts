import { Prisma, Organization } from '@prisma/client';
import Joi from 'joi';

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
  contactPhone: Joi.string().empty(''),
  organizationType: Joi.string().empty(''),
  workType: Joi.string().empty(''),
  website: Joi.string().empty(''),
  // .domain()
  locationType: Joi.string().empty(''),
  address: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'Address is required',
    }),
  missionStatement: Joi.string().empty(''),
  shortHistory: Joi.string().empty(''),
  lgbtqDemographic: Joi.array().unique().items(Joi.string()),
  raceDemographic: Joi.array().unique().items(Joi.string()),
  ageDemographic: Joi.array().unique().items(Joi.string()),
  // capacity: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() }),
  ein: Joi.string().empty(''),
  // foundingDate: Joi.date(),
  // FIXME, is501c3 not turning red
  is501c3: Joi.boolean()
    .empty(false)
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'This is required',
    }),
  proj1: Joi.string().empty(''),
  proj2: Joi.string().empty(''),
  proj3: Joi.string().empty(''),
  // TODO: add short required validation
});

export default schema;
