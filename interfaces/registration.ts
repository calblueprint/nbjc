import Joi from 'joi';

const schema = Joi.object({
  orgName: Joi.string().required(),
  workType: Joi.array().min(1),
  orgType: Joi.array().min(1),
  contactName: Joi.string().required(),
  contactEmail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  website: Joi.string().required(),
  location: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipcode: Joi.number().required(),
  EIN: Joi.number(),
  foundingDate: Joi.string().required(),
  ages: Joi.array().min(1),
  orientation: Joi.array().min(1),
  ethnicity: Joi.array().min(1),
  missionHistory: Joi.string().required(),
  proj1: Joi.string().required(),
  proj2: Joi.string().required(),
  proj3: Joi.string().required(),
  short1: Joi.string().required(),
  short2: Joi.string().required(),
  short3: Joi.string().required(),
});

export default schema;
