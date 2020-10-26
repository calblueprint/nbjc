// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export type Moderator = {
  id: number;
  name: string;
};

// TODO: logo needs to be type of an image.... saving as string for now
export type OrgApp = {
  id: number;
  orgType: string;
  date: number;
  name: string;
  logo: string;
  description: string;
  contact: string;
  email: string;
  website: string;
  workType: string;
};

export type Organization = {
  id: number;
  name: string;
};

export type Form = {
  name: string;
  age: number | string;
};
