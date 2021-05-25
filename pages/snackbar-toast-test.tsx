// TODO: REMOVE PAGE
import Link from 'next/link';
import Layout from 'components/Layout';
import Toast from 'components/Toast';
import { useSnackbar } from 'notistack';

// you don't need to accept incoming changes here
// 'acceptedAlert','verifyEmailAlert', 'userExistsError'
const Test: React.FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
      <button
        type="button"
        onClick={() =>
          enqueueSnackbar(
      'Testing snack bar'
          )
        }
      >
        hello
      </button>
      <button
        type="button"
        onClick={() => enqueueSnackbar('success', { variant: 'success' })}
      >
        success
      </button>
      <button
        type="button"
        onClick={() => enqueueSnackbar('error', { variant: 'error' })}
      >
        error
      </button>
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }}
        type="success"
      >
        Organization Name has been successfully accepted.
      </Toast>
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
          // action: (
          //   <>
          //     <Button>hello</Button>
          //     <Button>testing</Button>
          //   </>
          // ),
          classes: {
            // root: 'maxWidth: 500',
          },
        }}
        type="success"
        showDismissButton
        // dualActionSpaced
        // disableClickaway
      >
        <div>
          Please check your inbox to verify your email, so you can activate your
          account and begin the organization application.
        </div>
      </Toast>
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          // action: (
          //   <>
          //     <Button>hello</Button>
          //     <Button>testing</Button>
          //   </>
          // ),
          classes: {
            // root: 'maxWidth: 500',
          },
        }}
        type="error"
        showDismissButton
        // dualActionSpaced
        disableClickaway
      >
        <div>
          Please check your inbox to verify your email, so you can activate your
          account and begin the organization application.
        </div>
      </Toast>
    </Layout>
  );
};

export default Test;
