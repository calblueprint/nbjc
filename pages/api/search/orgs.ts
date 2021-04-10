import prisma from 'utils/prisma';
import { Organization, LgbtqDemographic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { MethodNotAllowed } from 'utils/error';

export const getFilteredOrganizations = async (): Promise<
  Organization[] | null
> => {
  // Conduct filtering here
  const orgs = await prisma.organization.findMany();
  return orgs;
};

// Find a better way around this mapping in the future

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Search is only for GET requests.
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  // console.log(req.body);
  const orgs = await prisma.organization.findMany({
    where: {
      lgbtqDemographic: {
        // hasSome: req.body.orientation as Array<LgbtqDemographic>,
        hasSome: [LgbtqDemographic.lgbtqAll, LgbtqDemographic.asexualAromantic],
      },
    },
  });

  console.log(orgs);
};
