import { Session } from 'interfaces/user';
import { useSession as useNextAuthSession } from 'next-auth/client';

export default function useSession(): [Session | null | undefined, boolean] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Session type from NextAuth doesn't cast to SessionUser
  return useNextAuthSession();
}
