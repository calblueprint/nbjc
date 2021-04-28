import { Organization } from '@prisma/client';
import Joi from 'joi';

export type BasicInfoForm = Pick<Organization, 
| 'address'
| 'website'
| 'ein'
| 'foundingDate'
| 'contactEmail'
>;

export type OperationsForm = {
  memberName1: string,
  memberTitle1: string,
  memberName2: string,
  memberTitle2: string,
  memberName3: string,
  memberTitle3: string,
  memberName4: string,
  memberTitle4: string,
  memberName5: string,
  memberTitle5: string,
};

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
});

export const OperationsInfoSchema = Joi.object({
    memberName1: Joi.string().required().messages({
      'any.required': 'Member name is required',
    }),
    memberTitle1: Joi.string().required().messages({
      'any.required': 'Member title is required'
    }),
    memberName2: Joi.string().required().messages({
      'any.required': 'Member name is required',
    }),
    memberTitle2: Joi.string().required().messages({
      'any.required': 'Member title is required'
    }),
    memberName3: Joi.string().required().messages({
      'any.required': 'Member name is required',
    }),
    memberTitle3: Joi.string().required().messages({
      'any.required': 'Member title is required'
    }),
    memberName4: Joi.string().required().messages({
      'any.required': 'Member name is required',
    }),
    memberTitle4: Joi.string().required().messages({
      'any.required': 'Member title is required'
    }),
    memberName5: Joi.string().required().messages({
      'any.required': 'Member name is required',
    }),
    memberTitle5: Joi.string().required().messages({
      'any.required': 'Member title is required'
    }),
});