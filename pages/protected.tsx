import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';

const Protected: React.FC = () => {
  const [session, loading] = useSession();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <div>
        Cannot see protected content because you are not logged in. Bad.
      </div>
    );
  }
  return <div>You can read me because you are logged in. Good job.</div>;
};

export default Protected;
