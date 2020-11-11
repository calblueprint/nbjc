import Joi from 'joi';
import {
  ApplicationStatus,
  OrganizationType,
  WorkType,
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';

const schema = Joi.object({
  applicationStatus: Joi.string().valid(...Object.values(ApplicationStatus)),
  organizationName: Joi.string().when('$strict', {
    is: true,
    then: Joi.required(),
  }),
  contactName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  contactEmail: Joi.string()
    .email()
    .when('$strict', { is: true, then: Joi.required() }),
  organizationType: Joi.string().valid(...Object.values(OrganizationType)),
  workType: Joi.string().valid(...Object.values(WorkType)),
  address: Joi.string(),
  lat: Joi.number(),
  long: Joi.number(),
  missionStatement: Joi.string(),
  shortHistory: Joi.string(),
  keyValue: Joi.string(),
  lgbtqDemographic: Joi.string().valid(...Object.values(LgbtqDemographic)),
  raceDemographic: Joi.string().valid(...Object.values(RaceDemographic)),
  ageDemographic: Joi.string().valid(...Object.values(AgeDemographic)),
  capacity: Joi.number(),
  ein: Joi.number(),
  foundingDate: Joi.date(),
}).when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
