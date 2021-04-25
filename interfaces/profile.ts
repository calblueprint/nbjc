import { Organization } from '@prisma/client';
import Joi from 'joi';

export type BasicInfoForm = Pick<Organization, 
| 'address'
| 'website'
| 'ein'
| 'foundingDate'
| 'contactEmail'
>;

export const BasicInfoSchema = Joi.object({
    address: Joi.string()
    .empty('')
    .when('$strict', { is: true, then: Joi.required() })
    .messages({
      'any.required': 'Address is required',
    }),
    website: Joi.string()
    .empty('')
    .uri({ domain: { tlds: false } })
    .messages({
      'string.uri':
        'Not a valid URL - remember http or https (https://nbjc.org)',
      'string.domain': 'Not a valid URL - missing domain (https://nbjc.org)',
    }),
    ein: Joi.string()
    .empty('')
    .pattern(/^[0-9]\d?-?\d{7}$/)
    .messages({ 'string.pattern.base': 'Not a valid EIN' }),
    foundingDate: Joi.date(),
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
})