import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import CreateError from 'utils/error';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
  // eslint-disable-next-line consistent-return
): Promise<any> => {
  const session = await getSession({ req });
  if (session) {
    res.send({ content: session, message: 'Successfully retrieved session.' });
  } else {
    return CreateError(
      400,
      'You must be sign in to retrieve sessions on this page.',
      res
    );
  }
};
