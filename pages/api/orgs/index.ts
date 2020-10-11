import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default (req: NextApiRequest, res: NextApiResponse): void => {
  
    if (req.method === 'CREATE') {
      handleCREATE(req, res);
    } else if (req.method === 'DELETE') {
      handleDELETE(req, res);
    } else if (req.method === 'UPDATE') {
        handleUPDATE(req, res);
    }
    else if (req.method === 'READ') {
        handleREAD(req, res);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  };

function handleCREATE( req, res ) => {
    const post = await prisma.orgnizations.create({
      where: { id: Number(postId) },
      include: { author: true },
    })
    res.json(post);
  }
  
  // DELETE /api/post/:id
  function handleDELETE( req, res): void => {
    const post = await prisma.organizations.delete({
        where: { id: Number(postId) },
    });
    res.json(post);
  }

  function handleUPDATE(req, res): void => {
    const post = await prisma.post.findOne({
        where: { id: Number(postId) },
        include: { author: true },
    });
    res.json(post);
  }

  function handleREAD(req, res): void => {
    const post = await prisma.post.findOne({
      where: { id: Number(postId) },
      include: { author: true },
    })
    res.json(post);
  }

