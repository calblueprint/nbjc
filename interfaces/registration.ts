import { Prisma } from '@prisma/client';
import Joi from 'joi';

export type Project = {
  id?: number;
  title: string;
  description: string;
};

export type ExistingProject = {
  id: number;
  title: string;
  description: string;
};

export type Response = {
  id: number[];
  response: string[];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const appQnRArgs = (id: number | undefined) =>
  Prisma.validator<Prisma.ApplicationQuestionArgs>()({
    select: {
      id: true,
      placeholder: true,
      question: true,
      hint: true,
      required: true,
      wordLimit: true,
      applicationResponses: {
        where: {
          organizationId: id ?? -1,
        },
        select: {
          answer: true,
        },
      },
    },
  });

export type AppQnR =
  | Prisma.ApplicationQuestionGetPayload<ReturnType<typeof appQnRArgs>>[]
  | null;

export type QnR = { questionId: number; response: string };

const form = Prisma.validator<Prisma.OrganizationArgs>()({
  select: {
    name: true,
    contactName: true,
    contactEmail: true,
    contactPhone: true,
    website: true,
    address: true,
    missionStatement: true,
    shortHistory: true,
    lgbtqDemographic: true,
    raceDemographic: true,
    ageDemographic: true,
    ein: true,
    is501c3: true,
  },
});

export type Form = Prisma.OrganizationGetPayload<typeof form> & {
  organizationType: string;
  workType: string;
  // short1: string;
  // short2: string;
  // short3: string;
  projects: Project[];
  qnr: QnR[];
  // proj1: string;
  // proj2: string;
  // proj3: string;
  // capacity: number | undefined;
  foundingDate: Date | undefined;
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
  foundingDate: Joi.date(),
  // FIXME, is501c3 not turning red
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
  // short1: Joi.string()
  //   .empty('')
  //   .when('$strict', {
  //     is: true,
  //     then: Joi.required(),
  //   })
  //   .messages({
  //     'any.required': 'short1 is required',
  //   }),
  // short2: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() }),
  // short3: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
