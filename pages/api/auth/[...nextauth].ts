import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import hashPassword from 'utils/hashPassword';
import sanitizeUser from 'utils/sanitizeUser';

type AuthorizeDTO = {
  email: string;
  password: string;
};

const prisma = new PrismaClient();

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: AuthorizeDTO) => {
        const user = await prisma.user.findOne({
          where: { email: credentials.email },
        });
        if (!user) {
          return Promise.reject(new Error('No account exists'));
        }
        // Verify that their password matches
        if (user.hashedPassword === hashPassword(credentials.password)) {
          return Promise.resolve(sanitizeUser(user));
        }
        return Promise.reject(new Error('Invalid password'));
      },
    }),
  ],
  // callbacks: {
  //   signIn: async (user: any, account: any, profile: any) => {
  //     return Promise.resolve(false);
  //   },
  // },
  database: process.env.DATABASE_URL,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  pages: {
    error: '/signin',
  },
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<void> => NextAuth(req, res, options);
