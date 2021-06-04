import { useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { TableOrganization, tableOrganizationArgs } from 'interfaces/admin';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import getSession from 'utils/getSession';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import styles from '../../styles/admin/Organizations.module.css';

type AdminOrgIndexProps = {
  orgs: TableOrganization[];
};

const AdminOrgIndex: React.FunctionComponent<AdminOrgIndexProps> = ({
  orgs,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [actionIndex, setActionIndex] = useState(-1);
  const [processingAction, setProcessingAction] = useState(false);

  const viewClick = (index: number) => {
    if (orgs[index]) {
      const { id } = orgs[index];
      router.push(`/orgs/${id}`);
    } else {
      enqueueSnackbar('Organization does not exist', { variant: 'error' });
    }
  };

  const deleteClick = (index: number) => {
    setActionIndex(index);
    setOpenDeleteModal(true);
  };

  const deleteOrg = async () => {
    setOpenDeleteModal(false);
    setProcessingAction(true);
    if (orgs[actionIndex]) {
      const { id, name } = orgs[actionIndex];
      try {
        const res = await fetch(`/api/org/${id}`, { method: 'DELETE' });
        if (res.ok) {
          enqueueSnackbar(`Successfully deleted ${name}`, {
            variant: 'success',
          });
          // Refresh data without full page reload
          router.replace(router.asPath);
        } else {
          enqueueSnackbar(`Failed to delete ${name}`, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar(`Failed to delete ${name}`);
      }
    } else {
      enqueueSnackbar('Organization does not exist', { variant: 'error' });
    }
    setProcessingAction(false);
  };

  const confirmDeleteDialog = (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>
        <div className={styles.dialogTitle}>
          Do you wish to delete this organization?
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will irreversibily delete all information for this organization.
          The organization user will still be able to log in and submit a new
          organization.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
          No
        </Button>
        <Button color="primary" variant="contained" onClick={deleteOrg}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Layout>
      {confirmDeleteDialog}
      <AdminIndex
        page="Organization"
        search="Look for an Organization"
        // TODO: Add button on click
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addButtonOnClick={() => {}}
      >
        <AdminTable
          data={orgs}
          pageType="organizations"
          primaryAction={viewClick}
          secondaryAction={deleteClick}
          actionLoadingIndex={processingAction ? actionIndex : undefined}
        />
      </AdminIndex>
    </Layout>
  );
};

export default AdminOrgIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const orgs = await prisma.organization.findMany({
        where: {
          active: true,
        },
        select: tableOrganizationArgs.select,
      });

      return {
        props: { orgs },
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
