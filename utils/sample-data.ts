import { Organization, User } from 'interfaces';

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export
export const sampleUserData: User[] = [
  { id: 101, name: 'Alice' },
  { id: 102, name: 'Bob' },
  { id: 103, name: 'Caroline' },
  { id: 104, name: 'Dave' },
];

export const sampleOrgData: Organization[] = [
  { id: 1, name: 'Blueprint', hasBlueberries: true },
  { id: 2, name: 'Redprint', hasBlueberries: false },
  { id: 3, name: 'Greenprint', hasBlueberries: true },
  { id: 420, name: 'Yellowprint', hasBlueberries: false },
];
