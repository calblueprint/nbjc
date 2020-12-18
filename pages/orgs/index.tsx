import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';
import prisma from 'utils/prisma';

const OrgsPage: React.FC = () => <></>;

export default OrgsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'organization') {
      const org = await prisma.organization.findOne({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (org) {
        return {
          redirect: {
            permanent: false,
            destination: `/orgs/${org.id}`,
          },
        };
      }
      return {
        notFound: true,
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log('error');
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
