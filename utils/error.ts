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

type ErrorCodes = 'DUP_EMAIL';

export default (
  statusCode: number,
  message: string | { [k: string]: string | string[] },
  res: NextApiResponse,
  errorCode?: ErrorCodes
): void => {
  return res.status(statusCode).json({
    error: {
      statusCode,
      message,
      errorCode,
    },
  });
};
