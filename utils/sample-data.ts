import { Organization, OrgApp } from 'interfaces';
import { User } from '@prisma/client';

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export

export const sampleUserData: User[] = [
  {
    id: 101,
    first_name: 'Alice',
    last_name: 'Wonderland',
    role: 'admin',
    email: 'alice@wonderland.in',
    email_verified: null,
    image: null,
    hashed_password: 'beep boop',
    created_at: new Date('2020-10-26T01:02:07.213Z'),
    updated_at: new Date('2020-10-26T01:02:07.213Z'),
  },
  {
    id: 102,
    first_name: 'Bob',
    last_name: 'Builder',
    role: 'moderator',
    email: 'bob@builder.com',
    email_verified: null,
    image: '/buildprint.png',
    hashed_password: 'i love hammers',
    created_at: new Date('2020-10-25T01:02:07.213Z'),
    updated_at: new Date('2020-10-25T01:02:09.213Z'),
  },
  {
    id: 103,
    first_name: 'Fred',
    last_name: 'Rick',
    role: 'moderator',
    email: 'Fred@rick.com',
    email_verified: null,
    image: null,
    hashed_password: 'i love code',
    created_at: new Date('2020-10-24T01:05:07.213Z'),
    updated_at: new Date('2020-10-24T01:10:07.213Z'),
  },
  {
    id: 104,
    first_name: 'Rick',
    last_name: 'Sanchez',
    role: 'admin',
    email: 'rick@morty.com',
    email_verified: new Date('2020-10-23T01:02:07.213Z'),
    image: '/c137.jpeg',
    hashed_password: 'vat of acid',
    created_at: new Date('2020-10-23T12:02:07.213Z'),
    updated_at: new Date('2020-10-23T01:02:07.213Z'),
  },
];

// TODO: implement logo and date differently...?
export const sampleOrgAppData: OrgApp[] = [
  {
    id: 107,
    orgType: '501(c)(3)',
    workType: 'service',
    website: 'white.com',
    email: 'skylerwhite@gmail.com',
    name: 'The DEA',
    logo: '/logo2.png',
    date: 10122000,
    description: 'Description for Org 1 here',
    contact: 'Skyler White',
  },
  {
    id: 108,
    orgType: '501(c)(3)',
    workType: 'service',
    website: 'google.com',
    email: 'walterwhite@gmail.com',
    name: 'The Car Wash',
    logo: '/logo1.png',
    date: 10102000,
    description: 'Description for Org 2 here',
    contact: 'Walter White',
  },
  {
    id: 109,
    orgType: 'for profit!',
    workType: 'service',
    website: '14125.com',
    email: 'pinkman@gmail.com',
    name: 'Los Pollos Hermanos',
    logo: '/oski.jpg',
    date: 10112000,
    description: 'Description for Org 3 here',
    contact: 'Jesse Pinkman',
  },
];

export const sampleOrgData: Organization[] = [
  { id: 1, name: 'Blueprint' },
  { id: 2, name: 'Redprint' },
  { id: 3, name: 'Greenprint' },
  { id: 420, name: 'Yellowprint' },
];
