import Joi from 'joi';

const schema = Joi.object({
  applicationStatus: Joi.string(),
  organizationId: Joi.number(),
  organizationName: Joi.string(),
  contactName: Joi.string(),
  contactEmail: Joi.string(),
  organizationType: Joi.string(),
  workType: Joi.string(),
  address: Joi.string(),
  lat: Joi.number(),
  long: Joi.number(),
  missionStatement: Joi.string(),
  shortHistory: Joi.string(),
  keyValue: Joi.string(),
  lgbtqDemographic: Joi.string(),
  raceDemographic: Joi.string(),
  ageDemographic: Joi.string(),
  capacity: Joi.number(),
  ein: Joi.number(),
  foundingDate: Joi.date(),
}).when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
