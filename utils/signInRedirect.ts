import { Session } from 'interfaces/user';
import { NextRouter } from 'next/router';

const signInRedirect = (router: NextRouter, session: Session): void => {
  const { role } = session.user;
  if (role === 'admin') {
    router.push('/admin');
  } else if (role === 'moderator') {
    router.push('/moderator');
  } else if (role === 'organization') {
    router.push(`/orgs`);
  } else {
    router.push('/');
  }
};

export default signInRedirect;
