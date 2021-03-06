import { useState } from 'react';
import prisma from 'utils/prisma';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { TableOrgApplication, tableOrgApplicationArgs } from 'interfaces/admin';
import getSession from 'utils/getSession';
import DeclineModal from 'components/moderator/DeclineModal';
import { ApplicationNote } from '@prisma/client';
import { useSnackbar } from 'notistack';

type AdminAppIndexProps = {
  orgs: TableOrgApplication[];
  notes: (ApplicationNote | null)[];
};

const AdminAppIndex: React.FunctionComponent<AdminAppIndexProps> = ({
  orgs,
  notes,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [openDeclineModal, setOpenDeclineModal] = useState(false);
  const [actionIndex, setActionIndex] = useState(-1);
  const [processingAction, setProcessingAction] = useState(false);

  const approveApp = async (
    approve: boolean,
    index: number,
    reason = ''
  ): Promise<void> => {
    setProcessingAction(true);
    if (orgs[index]) {
      if (approve) {
        /** put in form of const res so you can say if res === ok then display this banner */
        try {
          const res = await fetch(`/api/app/orgs/${orgs[index].id}/approve`, {
            method: 'POST',
          });
          if (res.ok) {
            enqueueSnackbar(`Successfully approved ${orgs[index].name}`, {
              variant: 'success',
            });
            // Refresh data without full page reload
            router.replace(router.asPath);
          } else {
            enqueueSnackbar(`Failed to approve ${orgs[index].name}`, {
              variant: 'error',
            });
          }
        } catch (err) {
          enqueueSnackbar(`Failed to approve ${orgs[index].name}`, {
            variant: 'error',
          });
        }
      } else {
        try {
          const res = await fetch(`/api/app/orgs/${orgs[index].id}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
          });
          if (res.ok) {
            enqueueSnackbar(`Successfully declined ${orgs[index].name}`, {
              variant: 'success',
            });
            // Refresh data without full page reload
            router.replace(router.asPath);
          } else {
            enqueueSnackbar(`Failed to reject ${orgs[index].name}`, {
              variant: 'error',
            });
          }
        } catch (err) {
          enqueueSnackbar(`Failed to reject ${orgs[index].name}`, {
            variant: 'error',
          });
        }
      }
    } else {
      enqueueSnackbar('Organization does not exist', {
        variant: 'error',
      });
    }
    setActionIndex(-1);
    setProcessingAction(false);
  };

  const acceptClick = (index: number) => {
    setActionIndex(index);
    approveApp(true, index);
  };

  const declineClick = (index: number) => {
    setActionIndex(index);
    setOpenDeclineModal(true);
  };

  return (
    <Layout>
      <DeclineModal
        id={orgs[actionIndex]?.id}
        openModal={openDeclineModal}
        closeModal={() => setOpenDeclineModal(false)}
        declineAction={(declineReason: string) =>
          approveApp(false, actionIndex, declineReason)
        }
        note={notes[actionIndex]?.note}
      />
      <AdminIndex
        page="Application"
        search="Look for an Application"
        // TODO: Add button on click
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addButtonOnClick={() => {}}
      >
        <AdminTable
          data={orgs}
          pageType="applications"
          secondaryAction={declineClick}
          primaryAction={acceptClick}
          actionLoadingIndex={processingAction ? actionIndex : undefined}
        />
      </AdminIndex>
    </Layout>
  );
};

export default AdminAppIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const orgsWithNote = await prisma.organization.findMany({
        where: {
          active: false,
        },
        select: { ...tableOrgApplicationArgs.select, applicationNote: true },
      });

      const [orgs, notes] = orgsWithNote.reduce<
        [TableOrgApplication[], (ApplicationNote | null)[]]
      >(
        (acc, curr) => {
          const { applicationNote, ...o } = curr;
          return [
            [...acc[0], o],
            [...acc[1], applicationNote],
          ];
        },
        [[], []]
      );

      return {
        props: { orgs, notes },
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
