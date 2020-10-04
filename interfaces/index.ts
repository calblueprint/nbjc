// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export type Admin = {
  id: number;
  name: string;
};

// TODO: logo needs to be type of an image.... but image isn't a primitive so how to implement this??
export type Org = {
  id: number;
  date: number;
  name: string;
  logo: string;
};
