import { Organization, User, OrgApp } from 'interfaces';

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export

export const sampleUserData: User[] = [
  { id: 101, name: 'Alice' },
  { id: 102, name: 'Bob' },
  { id: 103, name: 'Caroline' },
  { id: 104, name: 'Dave' },
];

// TODO: implement logo and date differently...
export const sampleOrgAppData: OrgApp[] = [
  {
    id: 107,
    name: 'Org1',
    logo: 'logo1.png',
    date: 10122000,
    description: 'Description for Org 1 here',
    question: 'bla blah',
  },
  {
    id: 108,
    name: 'Org2',
    logo: 'logo2.png',
    date: 10102000,
    description: 'Description for Org 2 here',
    question: 'la blah',
  },
];

export const sampleOrgData: Organization[] = [
  { id: 1, name: 'Blueprint' },
  { id: 2, name: 'Redprint' },
  { id: 3, name: 'Greenprint' },
  { id: 420, name: 'Yellowprint' },
];
