import { ApplicationQuestion, Organization, User } from '@prisma/client';

export type TableApplicationQuestion = Pick<
  ApplicationQuestion,
  'id' | 'question' | 'required' | 'createdAt' | 'updatedAt'
>;

export type TableOrganization = Pick<
  Organization,
  | 'id'
  | 'name'
  | 'organizationType'
  | 'workType'
  | 'contactName'
  | 'contactEmail'
  | 'createdAt'
>;

export type TableOrgApplication = Pick<
  Organization,
  | 'id'
  | 'name'
  | 'applicationStatus'
  | 'contactName'
  | 'contactEmail'
  | 'contactPhone'
  | 'createdAt'
>;

export type TableUser = Pick<
  User,
  'id' | 'role' | 'email' | 'emailVerified' | 'createdAt' | 'updatedAt'
>;
