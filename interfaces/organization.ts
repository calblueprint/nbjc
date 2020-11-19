import Joi from 'joi';
import {
  ApplicationStatus,
  OrganizationType,
  WorkType,
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  OrganizationGetPayload,
} from '@prisma/client';

export type PublicOrganization = OrganizationGetPayload<{
  select: {
    id: true;
    name: true;
    organizationType: true;
    workType: true;
    lat: true;
    long: true;
  };
}>;

const schema = Joi.object({
  name: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  long: Joi.number(),
  lat: Joi.number(),
  applicationStatus: Joi.string().valid(...Object.values(ApplicationStatus)),
  active: Joi.boolean(),
  contactName: Joi.string().when('$strict', { is: true, then: Joi.required() }),
  contactEmail: Joi.string()
    .email()
    .when('$strict', { is: true, then: Joi.required() }),
  organizationType: Joi.string().valid(...Object.values(OrganizationType)),
  workType: Joi.string().valid(...Object.values(WorkType)),
  address: Joi.string(),
  missionStatement: Joi.string(),
  shortHistory: Joi.string(),
  keyValue: Joi.string(),
  lgbtqDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(LgbtqDemographic))),
  raceDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(RaceDemographic))),
  ageDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(AgeDemographic))),
  capacity: Joi.number(),
  ein: Joi.number(),
  foundingDate: Joi.date(),
  is501c3: Joi.boolean(),
}).when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
