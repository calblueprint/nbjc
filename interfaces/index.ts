// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

// *****
// THIS IS A POTENTIALLY BREAKING LINE-- USER WAS FORMERLY EXPORTED WITH 'ID' AND 'NAME'
// *****
import { User } from '@prisma/client';

export type SanitizedUser = Omit<User, 'hashedPassword'>;

export type Moderator = {
  id: number;
  name: string;
};

// TODO: logo needs to be type of an image.... saving as string for now
export type OrgApp = {
  id: number;
  date: number;
  name: string;
  logo: string;
  description: string;
  question: string;
};

export type Organization = {
  id: number;
  name: string;
};
