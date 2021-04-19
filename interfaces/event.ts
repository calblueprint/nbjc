import Joi from 'joi';
import { Prisma } from '@prisma/client';

export type Event = Prisma.OrganizationEventGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    address: true;
    link: true;
    lgbtqDemographic: true;
    raceDemographic: true;
    ageDemographic: true;
    organizationId: true;
    startDatetime: true;
    endDatetime: true;
  };
}>;

const schema = Joi.object({
  title: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .empty('')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Description is required',
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
  organizationId: Joi.number(),
  startDatetime: Joi.date().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  endDatetime: Joi.date(),

  // leaving in case we want to add this validation in the future:

  // link: Joi.string()
  //   .empty('')
  //   .uri({ domain: { tlds: false } })
  //   .messages({
  //     'string.uri':
  //       'Not a valid URL - remember http or https (https://nbjc.org)',
  //     'string.domain': 'Not a valid URL - missing domain (https://nbjc.org)',
  //   }),
  // locationType: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() })
  //   .messages({ 'any.required': 'Location Type is required' }),
  // address: Joi.string()
  //   .empty('')
  //   .when('$strict', { is: true, then: Joi.required() })
  //   .messages({
  //     'any.required': 'Address is required',
  //   }),
});

export default schema;
