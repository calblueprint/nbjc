import prisma from 'utils/prisma';
import { TableUser, tableUserArgs } from 'interfaces/admin';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
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
import { ModeratorInviteDTO } from 'pages/api/invites/moderator';
import Toast from 'components/Toast';
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
  const [submissionError, setSubmissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onInvite = async (): Promise<void> => {
    setSubmissionError(false);
    try {
      if (!inviteEmail) {
        throw new Error('Please input an email!');
      }
      const inviteRes = await fetch('/api/invites/moderator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: inviteEmail,
        } as ModeratorInviteDTO),
      });

      if (!inviteRes.ok) {
        const inviteErr = await inviteRes.json();
        throw inviteErr.error;
      }
    } catch (err) {
      setErrorMessage(err.message);
      setSubmissionError(true);
    }
    setModal(false);
    setInviteEmail('');
    setInviteName('');
  };

  const handleClickOpen = (): void => {
    setModal(true);
  };

  const handleClickClose = (): void => {
    setModal(false);
  };

  const renderErrorToast = (): JSX.Element => {
    return (
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }}
        type="error"
        showDismissButton
        disableClickaway
      >
        {errorMessage}
      </Toast>
    );
  };

  const inviteModal = (): JSX.Element => (
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
          onClick={onInvite}
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
      {submissionError ? renderErrorToast() : null}
      {inviteModal()}
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
      const users = await prisma.user.findMany({
        select: tableUserArgs.select,
      });

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
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
