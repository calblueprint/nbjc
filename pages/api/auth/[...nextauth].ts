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
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: AuthorizeDTO) => {
        const user = await prisma.user.findOne({
          where: { email: credentials.email },
        });
        if (!user) {
          // Change this to be an error page
          throw new Error('No account exists');
        }
        // Verify that their password matches
        if (user.hashed_password === hashPassword(credentials.password)) {
          return sanitizeUser(user);
        }
        // Password mismatch
        // Change this to be an error page
        throw new Error('Invalid password');
      },
    }),
  ],
  database: process.env.DATABASE_URL,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  },

  // Below are used for placeholder for now, can be used to redirect to different pages in the app later.

  // pages: {
  // signIn: '/credentials-signin', // Displays signin buttons
  // signOut: '/api/auth/signout', // Displays form with sign out button
  // error: '/api/auth/error', // Error code passed in query string as ?error=
  // verifyRequest: '/api/auth/verify-request', // Used for check email page
  // newUser: 'signin', // If set, new users will be directed here on first sign in
  // },
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<void> => NextAuth(req, res, options);
