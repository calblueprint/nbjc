import { Prisma } from '@prisma/client';

export const tableApplicationQuestionArgs = Prisma.validator<
  Prisma.ApplicationQuestionArgs
>()({
  select: {
    id: true,
    question: true,
    required: true,
    createdAt: true,
    updatedAt: true,
  },
});

export type TableApplicationQuestion = Prisma.ApplicationQuestionGetPayload<
  typeof tableApplicationQuestionArgs
>;

export const tableOrganizationArgs = Prisma.validator<
  Prisma.OrganizationArgs
>()({
  select: {
    id: true,
    name: true,
    organizationType: true,
    workType: true,
    contactName: true,
    contactEmail: true,
    createdAt: true,
  },
});

export type TableOrganization = Prisma.OrganizationGetPayload<
  typeof tableOrganizationArgs
>;

export const tableOrgApplicationArgs = Prisma.validator<
  Prisma.OrganizationArgs
>()({
  select: {
    id: true,
    name: true,
    applicationStatus: true,
    contactName: true,
    contactEmail: true,
    contactPhone: true,
    createdAt: true,
  },
});

export type TableOrgApplication = Prisma.OrganizationGetPayload<
  typeof tableOrgApplicationArgs
>;

export const tableUserArgs = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    role: true,
    email: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  },
});

export type TableUser = Prisma.UserGetPayload<typeof tableUserArgs>;
