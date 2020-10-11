import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function handleCREATE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const post = await prisma.organizations.create({
    data: {
      name: req.body.name,
      long: req.body.long,
      lat: req.body.lat,
      type: req.body.type,
    },
  });
  res.json(post);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const post = await prisma.organizations.delete({
    where: { id: Number(req.id) },
  });
  res.json(post);
}

async function handleUPDATE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const post = await prisma.organizations.findOne({
    where: { id: Number(postId) },
    include: { author: true },
  });
  res.json(post);
}

async function handleREAD(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const post = await prisma.organizations.findOne({
    where: { id: Number(postId) },
    include: { author: true },
  });
  res.json(post);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'CREATE') {
    handleCREATE(req, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(req, res);
  } else if (req.method === 'UPDATE') {
    handleUPDATE(req, res);
  } else if (req.method === 'READ') {
    handleREAD(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};
