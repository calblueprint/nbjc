import { Organization, User, OrgApp } from 'interfaces';

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export

export const sampleUserData: User[] = [
  { id: 101, name: 'Alice' },
  { id: 102, name: 'Bob' },
  { id: 103, name: 'Caroline' },
  { id: 104, name: 'Dave' },
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
