import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import CreateError from 'utils/error';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req });
  if (session) {
    return res.send({
      content: session,
      message: 'Successfully retrieved session.',
    });
  }
  return CreateError(
    401,
    'You must be sign in to retrieve sessions on this page.',
    res
  );
};
