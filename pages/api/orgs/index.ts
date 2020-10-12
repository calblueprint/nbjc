import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function handleCREATE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.body.name) {
    try {
      const newOrg = await prisma.organizations.create({
        data: {
          name: req.body.name,
          long: req.body.long,
          lat: req.body.lat,
          type: req.body.type,
        },
      });
      res.json(newOrg);
    } catch (err) {
      console.log(err);
    }
  } else {
    res
      .status(500)
      .json({ statusCode: 500, message: 'Org name not passed in.' });
  }
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.query.id) {
    try {
      const deletedOrg = await prisma.organizations.delete({
        where: { id: Number(req.query.id) },
      });
      res.json(deletedOrg);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(500).json({ statusCode: 500, message: 'Org ID not passed in.' });
  }
}

async function handlePATCH(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.query.id) {
    try {
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
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(500).json({ statusCode: 500, message: 'Org ID not passed in.' });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.query.id) {
    try {
      const org = await prisma.organizations.findOne({
        where: { id: Number(req.query.id) },
      });
      res.json(org);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(500).json({ statusCode: 500, message: 'Org ID not passed in.' });
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    handleCREATE(req, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(req, res);
  } else if (req.method === 'PATCH') {
    handlePATCH(req, res);
  } else if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};
