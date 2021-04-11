import {
  OrganizationType,
  AgeDemographic,
  LgbtqDemographic,
  RaceDemographic,
  WorkType,
} from '@prisma/client';

export const OrganizationTypeLabels: Record<OrganizationType, string> = {
  [OrganizationType.grassrootsLocal]: 'Grassroots/Local',
  [OrganizationType.statewide]: 'Statewide',
  [OrganizationType.national]: 'National',
  [OrganizationType.other]: 'Other',
};

export const AgeDemographicLabels: Record<AgeDemographic, string> = {
  [AgeDemographic.child]: 'Children',
  [AgeDemographic.teen]: 'Teens',
  [AgeDemographic.adult]: 'Adults',
  [AgeDemographic.senior]: 'Seniors',
};

export const RaceDemographicLabels: Record<RaceDemographic, string> = {
  [RaceDemographic.black]: 'Black',
  [RaceDemographic.native]: 'Native',
  [RaceDemographic.hispanic]: 'Hispanic',
  [RaceDemographic.asian]: 'Asian',
  [RaceDemographic.arab]: 'Arab',
  [RaceDemographic.white]: 'White',
  [RaceDemographic.other]: 'Other',
};

export const LgbtqDemographicLabels: Record<LgbtqDemographic, string> = {
  [LgbtqDemographic.queer]: 'Queer',
  [LgbtqDemographic.asexualAromantic]: 'Asexual/Aromantic',
  [LgbtqDemographic.bisexual]: 'Bisexual',
  [LgbtqDemographic.pansexual]: 'Pansexual',
  [LgbtqDemographic.lesbianSgl]: 'Lesbian/SGL',
  [LgbtqDemographic.gaySgl]: 'Gay/SGL',
  [LgbtqDemographic.straightHeterosexual]: 'Straight/Heterosexual',
  [LgbtqDemographic.other]: 'Other',
};

export const WorkTypeLabels: Record<WorkType, string> = {
  [WorkType.advocacy]: 'Advocacy',
  [WorkType.directService]: 'Direct Service',
  [WorkType.networkingSocial]: 'Networking Social',
};
