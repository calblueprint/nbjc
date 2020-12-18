import prisma from 'utils/prisma';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import hashPassword from 'utils/hashPassword';
import sanitizeUser from 'utils/sanitizeUser';
import { SanitizedUser, SessionUser, Session } from 'interfaces/user';

type AuthorizeDTO = {
  email: string;
  password: string;
};

type CustomToken = SessionUser & { iat: number; exp: number };

type Token = CustomToken;

type Account = {
  id: string;
  type: 'credentials';
};

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
  callbacks: {
    session: async (session: Omit<Session, 'user'>, user: SessionUser) => {
      const customSession: Session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken: session.accessToken,
        expires: session.expires,
      };
      return Promise.resolve(customSession);
    },
    jwt: async (
      token: Token,
      user?: SanitizedUser,
      _account?: Account,
      _profile?: SanitizedUser,
      _isNewUser?: boolean
    ) => {
      if (token.id) {
        const newUser = await prisma.user.findOne({
          where: { id: token.id },
          select: { email: true, role: true },
        });
        if (newUser) {
          const customToken: SessionUser = {
            id: token.id,
            email: newUser.email,
            role: newUser.role,
          };
          return Promise.resolve(customToken);
        }
      }
      // Check if on sign in
      if (user) {
        const customToken: SessionUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        return Promise.resolve(customToken);
      }
      return Promise.resolve(token);
    },
  },
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Incompatible types in callbacks.session and callbacks.jwt
  return NextAuth(req, res, options);
};
