import { PrismaClient, Organization } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import OrganizationSchema from 'interfaces/organization';
import { Project } from 'interfaces/registration';
import CreateError, { MethodNotAllowed } from 'utils/error';
import parseValidationError from 'utils/parseValidationError';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return MethodNotAllowed(req.method, res);
  }

  const isSubmit = req.query.submitting === 'true';

  const { userEmail, projects, projIDsToDelete, ...body } = req.body;
  const { error, value } = OrganizationSchema.validate(body, {
    abortEarly: false,
    context: {
      strict: isSubmit,
    },
  });
  if (error) {
    return CreateError(400, parseValidationError(error), res);
  }

  const user = await prisma.user.findOne({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
    },
  });

  const userId = user?.id;
  if (!userId) {
    return CreateError(500, 'Failed to find user', res);
  }

  const applicationStatus = isSubmit ? 'submitted' : 'draft';
  const active = isSubmit ? false : undefined;
  const data = { ...value, applicationStatus, active } as Organization;

  const appProjs = projects as Project[];
  const deleteProjs = projIDsToDelete as number[];
  const toCreate = appProjs.filter(({ id }) => !!id); // projects without id, to be created
  const toUpdate = appProjs.filter((i) => !i.id); // projects to update
  let newOrg;
  try {
    newOrg = await prisma.organization.upsert({
      where: {
        userId,
      },
      create: {
        ...data,
        // Would prefer to use createMany here. Currently this causes a POST request error
        // organizationProjects: {
        //   create: toCreate.map(({ title, description }) => ({
        //     title,
        //     description,
        //     connect: {
        //       id: newOrg.id,
        //     },
        //   })),
        // },
        user: {
          connect: {
            id: userId,
          },
        },
      },

      update: {
        ...data,
        organizationProjects: {
          updateMany: toUpdate.map(({ id, title, description }) => ({
            where: {
              id,
            },
            data: {
              title,
              description,
            },
          })),
          deleteMany: deleteProjs.map((id) => ({ id })),
        },
      },
    });
  } catch (err) {
    console.log(err);
    return CreateError(500, 'Failed to create organization', res);
  }

  await prisma.organizationProject.deleteMany;

  // FIXME: This is a temporary (ugly) solution for creating projects
  try {
    for (let i = 0; i < toCreate.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const response = await prisma.organizationProject.create({
        data: {
          title: toCreate[i].title,
          description: toCreate[i].description,
          organization: {
            connect: {
              id: newOrg.id,
            },
          },
        },
      });
    }
  } catch (err) {
    return CreateError(500, 'Failed to create project', res);
  }

  return res.json(newOrg);
};
