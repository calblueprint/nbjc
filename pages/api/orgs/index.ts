import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function handleCREATE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const newOrg = await prisma.organizations.create({
    data: {
      name: req.body.name,
      long: req.body.long,
      lat: req.body.lat,
      type: req.body.type,
    },
  });
  res.json(newOrg);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const deletedOrg = await prisma.organizations.delete({
    where: { id: Number(req.query.id) },
  });
  res.json(deletedOrg);
}

async function handleUPDATE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const updatedOrg = await prisma.organizations.update({
    where: { id: Number(req.query.id) },
    data: {
      name: req.body.name,
      long: req.body.long,
      lat: req.body.lat,
      type: req.body.type,
    },
  });
  res.json(updatedOrg);
}

async function handleREAD(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const org = await prisma.organizations.findOne({
    where: { id: Number(req.query.id) },
  });
  res.json(org);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.query.method === 'CREATE') {
    handleCREATE(req, res);
  } else if (req.query.method === 'DELETE') {
    handleDELETE(req, res);
  } else if (req.query.method === 'UPDATE') {
    handleUPDATE(req, res);
  } else if (req.query.method === 'READ') {
    handleREAD(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};
