import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().empty('').default('asdfs').when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  contactName: Joi.string()
    .empty('')
    .default('asdf')
    .when('$strict', { is: true, then: Joi.required() }),
  contactEmail: Joi.string()
    .empty('')
    .default('test@email.com')
    .email({ tlds: { allow: false } })
    .when('$strict', { is: true, then: Joi.required() }),
  organizationType: Joi.string().allow('').when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  workType: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  website: Joi.string().allow('').uri(),
  locationType: Joi.string().allow(''),
  address: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  missionStatement: Joi.string().allow('').when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  shortHistory: Joi.string().allow('').when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  keyValue: Joi.string().when('$strict', { is: true, then: Joi.required() }),
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
  capacity: Joi.number().when('$strict', { is: true, then: Joi.required() }),
  ein: Joi.number().when('$strict', { is: true, then: Joi.required() }),
  foundingDate: Joi.date().when('$strict', { is: true, then: Joi.required() }),
  is501c3: Joi.boolean().when('$strict', { is: true, then: Joi.required() }),
  proj1: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  proj2: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  proj3: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  short1: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  short2: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
  short3: Joi.string()
    .allow('')
    .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
