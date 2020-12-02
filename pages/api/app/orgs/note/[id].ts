import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import CreateError from 'utils/error';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const orgId = req.query.id;
  const orgNote = req.body.text;
  try {
    await prisma.applicationNote.upsert({
      where: { id: Number(orgId) },
      update: { note: String(orgNote) },
      create: { note: String(orgNote) },
    });
    return res.status(200).json({ status: 'success' });
  } catch (ex) {
    return CreateError(500, `Failed to auto-save note for ${orgId}`, res);
  }
};
