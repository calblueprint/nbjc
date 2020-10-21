import { csrfToken, signIn } from 'next-auth/client';
import { NextPageContext, GetStaticProps } from 'next';

interface CredentialsProps {
  csrfToken: string;
}

const CredentialsSignIn: React.FC<CredentialsProps> = (props) => {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
      <input name="csrfToken" type="hidden" />
      <label htmlFor="email">
        Email
        <input name="email" type="text" />
      </label>
      <label htmlFor="password">
        Password
        <input name="password" type="text" />
      </label>
      <button type="submit" onClick={(e) => console.log(e)}>
        Sign in
      </button>
    </form>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { csrfToken: await csrfToken() },
  };
};

export default CredentialsSignIn;
