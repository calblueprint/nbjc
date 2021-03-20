// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

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
  ages: string[];
  identity: string[];
  ethnicity: string[];
  EIN: number;
};

export type Organization = {
  id: number;
  name: string;
};

export type Question = {
  id: number;
  content: string;
};
