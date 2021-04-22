import prisma from 'utils/prisma';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { TableUser } from 'interfaces/admin';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';
import {
  Dialog,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
} from '@material-ui/core';
import { useState } from 'react';
import styles from '../../styles/admin/Users.module.css';

type AdminUsersIndexProps = {
  users: TableUser[];
};

const AdminUsersIndex: React.FunctionComponent<AdminUsersIndexProps> = ({
  users,
}) => {
  const [openModal, setModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleClickOpen = (): void => {
    setModal(true);
  };

  const handleClickClose = (): void => {
    console.log(inviteEmail);
    console.log(inviteName);
    setModal(false);
  };

  const inviteModal = () => (
    <Dialog
    open={openModal}
    onClose={handleClickClose}
    className={styles.newModal}
    fullWidth
    >
      <div className={styles.dialogTitle}> Invite Moderator </div>
      <div className={styles.modalInput}>
        <DialogContentText className={styles.modalInputLabel}>
          Name
        </DialogContentText>
        <TextField
          id="name"
          variant="outlined"
          placeholder="FirstName LastName"
          value={inviteName}
          onChange={(event) => setInviteName(event.target.value)}
        />
      </div>
      <div className={styles.modalInput}>
        <DialogContentText className={styles.modalInputLabel}>
          Email
        </DialogContentText>
        <TextField
          id="email"
          type="email"
          variant="outlined"
          placeholder="email@example.org"
          value={inviteEmail}
          onChange={(event) => setInviteEmail(event.target.value)}
        />
      </div>
      <DialogActions>
        <Button
          className={styles.inviteButton}
          onClick={handleClickClose}
          variant="contained"
          color="primary"
        >
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Layout title="Admin Users">
      { inviteModal() }
      <AdminIndex
        page="User"
        search="Look for a User"
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addButtonOnClick={handleClickOpen}
      >
        <AdminTable data={users} pageType="users" />
      </AdminIndex>
    </Layout>
  );
};

export default AdminUsersIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          role: true,
          email: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const users = JSON.parse(JSON.stringify(allUsers));
      return {
        props: { users },
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
