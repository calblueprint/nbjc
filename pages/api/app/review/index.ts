import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'utils/prisma';

import CreateError, { MethodNotAllowed } from 'utils/error';
import Joi from 'joi';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') return MethodNotAllowed(req.method, res);

  // if (Joi.number().integer().validate(req.query.id).error) {
  //   return CreateError(400, `ID ${req.query.id} is not a number`, res);
  // }
  // const organizationId = Number(req.query.id);

  const dataReview = req.body?.reason;

  if (Joi.string().empty('').validate(dataReview).error) {
    return CreateError(400, `Review should be a string`, res);
  }

  const review = dataReview as string;
  try {
    console.log(req.body);
    console.log(review);
    const theReview = await prisma.organizationApplicationReviews.create({
      data: {
        reason: review,
        organization: { connect: { id: req.body?.organizationId } },
      },
    });
    return res.json(theReview);
  } catch (ex) {
    return CreateError(
      500,
      `Failed to create the application review for ${req.body?.organizationId}`,
      res
    );
  }
};
