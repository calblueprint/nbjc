import { Question } from 'interfaces';
import { User, Organization } from '@prisma/client';

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export

export const sampleUserData: User[] = [
  {
    id: 101,
    role: 'admin',
    email: 'alice@wonderland.in',
    emailVerified: null,
    image: null,
    hashedPassword: 'beep boop',
    createdAt: new Date('2020-10-26T01:02:07.213Z'),
    updatedAt: new Date('2020-10-26T01:02:07.213Z'),
  },
  {
    id: 102,
    role: 'moderator',
    email: 'bob@builder.com',
    emailVerified: null,
    image: '/buildprint.png',
    hashedPassword: 'i love hammers',
    createdAt: new Date('2020-10-25T01:02:07.213Z'),
    updatedAt: new Date('2020-10-25T01:02:09.213Z'),
  },
  {
    id: 103,
    role: 'moderator',
    email: 'Fred@rick.com',
    emailVerified: null,
    image: null,
    hashedPassword: 'i love code',
    createdAt: new Date('2020-10-24T01:05:07.213Z'),
    updatedAt: new Date('2020-10-24T01:10:07.213Z'),
  },
  {
    id: 104,
    role: 'admin',
    email: 'rick@morty.com',
    emailVerified: new Date('2020-10-23T01:02:07.213Z'),
    image: '/c137.jpeg',
    hashedPassword: 'vat of acid',
    createdAt: new Date('2020-10-23T12:02:07.213Z'),
    updatedAt: new Date('2020-10-23T01:02:07.213Z'),
  },
];

export const sampleQuestionData: Question[] = [
  { id: 1, content: 'asdfsdfdfasdf' },
  { id: 2, content: 'testing' },
  { id: 3, content: 'helloheloooeoeoeoe' },
  { id: 4, content: 'Yellowprint!!!!' },
];
