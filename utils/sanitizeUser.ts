import { User } from '@prisma/client';
import { SanitizedUser } from 'interfaces/user';

/**
 * Remove unsafe fields from our internal DB representation of a user, for use on the client.
 * @param user - the original User object fetched with Prisma
 */
const sanitizeUser = (user: User): SanitizedUser => {
  // Remove hashedPassword
  const { hashedPassword: _hashedPassword, ...sanitizedUser } = user;
  return sanitizedUser;
};

export default sanitizeUser;
