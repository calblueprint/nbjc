import Joi from 'joi';

export type Form = {
  name: string;
  contactName: string;
  contactEmail: string;
  organizationType: string;
  workType: string;
  website: string;
  locationType: string;
  address: string;
  missionStatement: string;
  shortHistory: string;
  lgbtqDemographic: string[];
  raceDemographic: string[];
  ageDemographic: string[];
  capacity: number | undefined;
  ein: string;
  foundingDate: Date | undefined;
  is501c3: boolean;
  short1: string;
  short2: string;
  short3: string;
  proj1: string;
  proj2: string;
  proj3: string;
};

const schema = Joi.object({
  name: Joi.string()
    .empty('')
    .default('asdfs')
    .when('$strict', {
      is: true,
      then: Joi.required(),
    })
    .messages({
      'any.required': 'Organization Name is required',
    }),
  contactName: Joi.string()
    .empty('')
    .default('asdf')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'Contact Name is required',
    }),
  contactEmail: Joi.string()
    .empty('')
    .default('test@email.com')
    .email({ tlds: { allow: false } })
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'Contact Email is required',
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
  locationType: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({ 'any.required': 'Location Type is required' }),
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
  keyValue: Joi.string(),
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
  capacity: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  ein: Joi.string()
    .allow('')
    .pattern(/^[0-9]\d?-?\d{7}$/)
    .messages({ 'string.pattern.base': 'Not a valid EIN' }),
  foundingDate: Joi.date(),
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
  short1: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  short2: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
  short3: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() }),
});

export default schema;
