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

  const { userEmail, projects, projToDelete, ...body } = req.body;
  const { error, value } = OrganizationSchema.validate(body, {
    abortEarly: false,
    context: {
      strict: isSubmit,
    },
  });
  if (error) {
    return CreateError(400, parseValidationError(error), res);
  }
  const appProjs = projects as Project[];
  const deleteProjs = projToDelete as number[];

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
  // const filteredItems = items.filter(item => !!item.title)

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
        user: {
          connect: {
            id: userId,
          },
        },
        // organizationProjects: {
        //   createMany: toCreate.map(({ id, title, description }) => ({
        //     data:
        //   })),

        // organizationProjects: {
        //   create: toCreate.map(({ id, title, description }) => ({
        //     title,
        //     description,
        //     connect: {
        //       id,
        //     },
        //   })),
        // },
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

  // try {
  //   const deleteProjects = await prisma.user.deleteMany({
  //     where: {
  //       OR: projToDelete,
  //     },
  //   });
  // } catch (err) {
  //   return CreateError(500, 'Failed to delete project', res);
  // }

  // FIXME: projects aren't getting created. Would be ideal to make it work using createMany
  // in the upsert above on line 68
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
