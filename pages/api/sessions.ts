import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const session = await getSession({ req });
  if (session) {
    res.send({ content: session, message: 'Successfully retrieved session.' });
  } else {
    res.send({
      error: 'You must be sign in to retrieve sessions on this page.',
    });
  }
};
