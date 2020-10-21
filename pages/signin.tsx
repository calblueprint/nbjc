import { providers, signIn } from 'next-auth/client';
import { NextPage, GetStaticProps } from 'next';

interface Props {
  providers: any[];
}

const SignIn: React.FC<Props> = (props) => {
  const { providers: propProviders } = props;
  console.log(propProviders);
  return (
    <>
      {Object.values(propProviders).map((provider) => (
        <div key={provider.name}>
          <button type="button" onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { providers: await providers() } }; // I am not sure why this props has to be configured so weirdly.
};

export default SignIn;
