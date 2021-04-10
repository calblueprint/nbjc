import {
  OrganizationType,
  LgbtqDemographic,
  RaceDemographic,
  WorkType,
} from '@prisma/client';

const OrganizationTypeLabels: Record<OrganizationType, string> = {
  grassrootsLocal: 'Grassroots/Local',
  statewide: 'Statewide',
  national: 'National',
  other: 'Other',
};

// const OrganizationTypeLabels: Record<OrganizationType, string> = {...}
