import { NextApiResponse } from 'next';

export const MethodNotAllowed = (
  method: string | undefined,
  res: NextApiResponse
): void =>
  res.status(405).json({
    error: {
      statusCode: 405,
      message: `The HTTP ${method} method is not supported at this route.`,
    },
  });

export default (
  statusCode: number,
  message: string,
  res: NextApiResponse
): void => {
  return res.status(statusCode).json({
    error: {
      statusCode,
      message,
    },
  });
};
