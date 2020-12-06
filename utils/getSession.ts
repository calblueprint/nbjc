import { IncomingMessage } from 'http';
import { Session } from 'interfaces/user';
import { getSession as getNextAuthSession } from 'next-auth/client';

interface NextContext {
  req?: IncomingMessage;
  ctx?: { req: IncomingMessage };
}

export default async function getSession(
  context?: NextContext & {
    triggerEvent?: boolean;
  }
): Promise<Session | null> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Session type from NextAuth doesn't cast to SessionUser
  return getNextAuthSession(context);
}
