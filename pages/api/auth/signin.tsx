import { NextPage } from 'next';
import { providers, signIn } from 'next-auth/client';

interface Props {
  userAgent?: string;
}

const SignIn: NextPage<Props> = () => (
  <>
    {Object.values(providers).map((provider) => (
      <div key={provider.name}>
        <button type="button" onClick={() => signIn(provider.id)}>
          Sign in with {provider.name}
        </button>
      </div>
    ))}
  </>
);

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
  };
};

export default SignIn;
