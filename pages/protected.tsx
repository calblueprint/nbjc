import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import Layout from 'components/Layout';

const Protected: React.FC = () => {
  const [session, loading] = useSession();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  if (session) {
    console.log(session);
  }

  // If no session exists, display access denied message
  return (
    <Layout>
      {session ? (
        <div>You can read me because you are logged in. Good job.</div>
      ) : (
        <div>
          Cannot see protected content because you are not logged in. Bad.
        </div>
      )}
    </Layout>
  );
};

export default Protected;
