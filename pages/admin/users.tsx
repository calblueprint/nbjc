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
  DialogTitle,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { ModeratorInviteDTO } from 'pages/api/invites/moderator';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import styles from '../../styles/admin/Users.module.css';

type AdminUsersIndexProps = {
  users: TableUser[];
};

const AdminUsersIndex: React.FunctionComponent<AdminUsersIndexProps> = ({
  users,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionIndex, setActionIndex] = useState(-1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onInvite = async (): Promise<void> => {
    try {
      if (!inviteEmail) {
        enqueueSnackbar('Please input an email', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        return;
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
        enqueueSnackbar(inviteErr.error, {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
      enqueueSnackbar(`Sent email invite to ${inviteEmail}!`, {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setOpenInviteModal(false);
    setInviteEmail('');
    setInviteName('');
  };

  const inviteModal = (
    <Dialog
      open={openInviteModal}
      onClose={() => setOpenInviteModal(false)}
      className={styles.newModal}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <div className={styles.dialogTitle}>
          Invite Moderator
          <IconButton
            aria-label="close"
            onClick={() => setOpenInviteModal(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions
        classes={{
          root: styles.dialogActions,
        }}
      >
        <Button onClick={onInvite} variant="contained" color="primary">
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );

  const resetPasswordClick = async (index: number) => {
    setProcessingAction(true);
    setActionIndex(index);
    if (users[index]) {
      const { email } = users[index];
      try {
        const res = await fetch(`/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email,
          }),
        });

        if (res.ok) {
          enqueueSnackbar(`Reset password email has been sent to ${email}`, {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(`Failed to send reset password email to ${email}`, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar(`Failed to send reset password email to ${email}`, {
          variant: 'error',
        });
      }
    } else {
      enqueueSnackbar('User does not exit', { variant: 'error' });
    }
    setActionIndex(-1);
    setProcessingAction(false);
  };

  const deleteClick = (index: number) => {
    setActionIndex(index);
    setOpenDeleteModal(true);
  };

  const deleteUser = async () => {
    setOpenDeleteModal(false);
    setProcessingAction(true);

    if (users[actionIndex]) {
      const { id, email } = users[actionIndex];
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          enqueueSnackbar(`Successfully deleted user ${email}`, {
            variant: 'success',
          });
          router.replace(router.asPath);
        } else {
          enqueueSnackbar(`Failed to delete user ${email}`, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar(`Failed to delete user ${email}`, {
          variant: 'error',
        });
      }
    } else {
      enqueueSnackbar('User does not exit', { variant: 'error' });
    }

    setActionIndex(-1);
    setProcessingAction(false);
  };

  const confirmDeleteDialog = (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>
        <div className={styles.dialogTitle}>
          Do you wish to delete this user?
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will delete all information for this user, and they will not be
          able to access their account again. If the user has created an
          organization, the organization will continue to exist. There is no
          recovering from this.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
          No
        </Button>
        <Button color="primary" variant="contained" onClick={deleteUser}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Layout title="Admin Users">
      {inviteModal}
      {confirmDeleteDialog}
      <AdminIndex
        page="User"
        search="Look for a User"
        addButtonOnClick={() => setOpenInviteModal(true)}
      >
        <AdminTable
          data={users}
          pageType="users"
          primaryAction={resetPasswordClick}
          secondaryAction={deleteClick}
          actionLoadingIndex={processingAction ? actionIndex : undefined}
        />
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
