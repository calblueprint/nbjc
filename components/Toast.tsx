import Head from 'next/head';
import Link from 'next/link';
import { Button, LinearProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
// yarn add react-toastify
import { ToastContainer, toast } from 'react-toastify';

type Props = {
  msg: string; // message for toast
  variant: string; // either 'alert' or 'error'
  position?:
    | 'top-center'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
    | undefined;
};

const Toast: React.FunctionComponent<Props> = ({ msg, variant, position }) => {
  toast(msg);
  return (
    <ToastContainer
      position={position}
      autoClose={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
    />
  );
};

export default Toast;
