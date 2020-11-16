// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type Moderator = {
  id: number;
  name: string;
};

export type Form = {
  workType: string[];
  orgType: string[];
  EIN: number | string;
  foundingDate: number | string;
  location: string;
  zipcode: number | string;
  street: string;
  city: string;
  state: string;
  orgName: string;
  contactName: string;
  contactEmail: string;
  website: string;
  missionHistory: string;
  short1: string;
  short2: string;
  short3: string;
  proj1: string;
  proj2: string;
  proj3: string;
  ages: string[];
  ethnicity: string[];
  orientation: string[];
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
  orientation: string[];
  ethnicity: string[];
};

export type Organization = {
  id: number;
  name: string;
};

export type Question = {
  id: number;
  content: string;
};
