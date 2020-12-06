import { ApplicationQuestion } from '@prisma/client';

export type TableApplicationQuestion = Pick<
  ApplicationQuestion,
  'id' | 'question' | 'required' | 'createdAt' | 'updatedAt'
>;
