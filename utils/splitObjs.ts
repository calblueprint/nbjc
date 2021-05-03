interface ID {
  id?: number;
}

interface KnownID {
  id: number;
}

//* ** Splitting appProjs into create, update, and delete ***//
// Takes in generic objects, and splits them up into `toCreate`, `toUpdate`, and `toDelete` variables for upsert API requests.
const SplitObjs = <T extends ID, K extends KnownID>(
  objs: T[],
  DBObjs: K[] | undefined
): [T[], T[] | undefined, number[]] => {
  // New projects are the ones without IDs yet.
  const toCreate = objs.filter((i) => !i.id);

  // Deleted projects are the projects in the DB that aren't passed into the API req.
  let toDelete: Set<number> = new Set();
  if (DBObjs) {
    const currIds = new Set(objs.filter(({ id }) => !!id).map((obj) => obj.id));
    // By filtering the DB projects for projects that aren't in the current projects ids passed into the API,
    // we know that it was deleted in the registration form.
    toDelete = new Set(
      DBObjs.filter((obj) => !currIds.has(obj.id)).map((obj) => obj.id)
    );
  }
  // Updated projects are the remaining projects. There aren't necessarily changed,
  // but making the PATCH request for projects that aren't modified won't change anything.
  const currObjs = objs.filter(({ id }) => !!id);
  let toUpdate;
  if (DBObjs) {
    toUpdate = currObjs.filter((obj) => !toDelete.has(obj.id!)); // Exclaimation added because we know that currObjs have IDs from line 35.
  }
  return [toCreate, toUpdate, Array.from(toDelete)];
};

export default SplitObjs;
