import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { MethodNotAllowed } from 'utils/error';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';

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

  // Only add filters if they are listed, otherwise use all filters
  const orientationBody =
    req.body.orientation.length === 0
      ? Object.keys(LgbtqDemographicLabels)
      : req.body.orientation;
  const ethnicityBody =
    req.body.ethnicity.length === 0
      ? Object.keys(RaceDemographicLabels)
      : req.body.ethnicity;
  const agesBody =
    req.body.ages.length === 0
      ? Object.keys(AgeDemographicLabels)
      : req.body.ages;

  const orgs = await prisma.organization.findMany({
    where: {
      name: {
        contains: req.body.orgName,
        mode: 'insensitive',
      },
      lgbtqDemographic: {
        hasSome: orientationBody,
      },
      raceDemographic: {
        hasSome: ethnicityBody,
      },
      ageDemographic: {
        hasSome: agesBody,
      },
    },
  });
  return res.json(orgs);
};
