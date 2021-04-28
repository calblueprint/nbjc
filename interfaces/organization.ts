import Joi from 'joi';
import {
  Prisma,
  ApplicationStatus,
  OrganizationType,
  WorkType,
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';

export const orgProfile = Prisma.validator<Prisma.OrganizationArgs>()({
  select: {
    active: true,
    id: true,
    name: true,
    organizationType: true,
    workType: true,
    address: true,
    missionStatement: true,
    shortHistory: true,
    lgbtqDemographic: true,
    raceDemographic: true,
    ageDemographic: true,
    capacity: true,
    ein: true,
    foundingDate: true,
    is501c3: true,
    website: true,
    user: {
      select: {
        id: true,
      },
    },
    organizationProjects: true,
  },
});

// export type orgProj = { id: number; title: string; description: string };
export type EditForm = Prisma.OrganizationGetPayload<{
  select: {
    name: true;
    contactName: true;
    contactEmail: true;
    contactPhone: true;
    organizationType: true;
    workType: true;
    address: true;
    missionStatement: true;
    shortHistory: true;
    lgbtqDemographic: true;
    raceDemographic: true;
    ageDemographic: true;
    // capacity: true;
    ein: true;
    // foundingDate: true;
    is501c3: true;
    website: true;
    organizationProjects: true;
  };
}>;

const schema = Joi.object({
  name: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  long: Joi.number(),
  lat: Joi.number(),
  applicationStatus: Joi.string().valid(...Object.values(ApplicationStatus)),
  active: Joi.boolean(),
  contactName: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  contactEmail: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.string().email().required() }),
  contactPhone: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  website: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.string().uri({ domain: {} }) }),
  organizationType: Joi.string()
    .empty('')
    .default(null)
    .valid(...Object.values(OrganizationType))
    .when('$strict', { is: true, then: Joi.required() }),
  workType: Joi.string()
    .empty('')
    .default(null)
    .valid(...Object.values(WorkType))
    .when('$strict', { is: true, then: Joi.required() }),
  address: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  missionStatement: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  shortHistory: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', { is: true, then: Joi.required() }),
  lgbtqDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(LgbtqDemographic)))
    .when('$strict', { is: true, then: Joi.array().min(1).required() }),
  raceDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(RaceDemographic)))
    .when('$strict', { is: true, then: Joi.array().min(1).required() }),
  ageDemographic: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.values(AgeDemographic)))
    .when('$strict', { is: true, then: Joi.array().min(1).required() }),
  // capacity: Joi.number(),
  ein: Joi.string()
    .empty('')
    .default(null)
    .when('$strict', {
      is: true,
      then: Joi.string().pattern(/^[0-9]\d?-?\d{7}$/),
    }),
  foundingDate: Joi.date(),
  is501c3: Joi.boolean(),
  organizationProjects: Joi.array().unique(),
}).when('$strict', { is: true, then: Joi.object().and('lat', 'long') });

export default schema;
