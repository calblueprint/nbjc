import { signIn, useSession } from 'next-auth/client';
import Link from 'next/link';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { useFormik, FormikHandlers, FormikHelpers, FormikErrors } from 'formik';
import { signinSchema } from 'interfaces/auth';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import { useEffect, useState } from 'react';
import Toast from 'components/Toast';

type FormValues = {
  email: string;
  password: string;
};


// UserSignIn page. Will need additional email verification to be able to create organizations.
const UserSignIn: React.FC = () => {
  // Get URL params for error callbacks.
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [toastMessage, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const errorBanner = router.query.error;


  useEffect(() => {
    const validateCode = async() => {
      if (router.query.verificationCode) {
        const res = await fetch('/api/emailVerification/verify', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verificationCode: router.query.verificationCode
          }),
        });
        const resJson = await res.json();
        if (resJson.error) {
          setToastType('error');
          setToast(resJson.error.message);
        } else {
          setToastType('success');
          setToast('Email successfully verified! Please sign in to use your account');
        }
      }
    }
    validateCode();
  }, [router.query]);

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    try {
      // Sign in with credentials

      // NOTE: If the below method fails because of 'Invalid password' or 'Unknown email', the error will be passed
      // into the URL params.
      signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
    } catch (err) {
      console.log(err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Validates inputs
  const validate = (values: FormValues): FormikErrors<FormValues> => {
    const { error } = signinSchema.validate(values, {
      abortEarly: false,
    });

    const msg: { [k: string]: string } = error
      ? error.details.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        )
      : {};

    return msg;
  };

  const constructRow = (
    varName: 'email' | 'password',
    handleChange: FormikHandlers['handleChange'],
    error?: string
  ): JSX.Element => (
    <div className={styles.field}>
      <div className={styles.entryName}>
        <Typography>{varName}</Typography>
      </div>
      <TextField
        className={styles.textField}
        size="small"
        error={Boolean(error)}
        name={varName}
        variant="outlined"
        onChange={handleChange}
        id={varName}
        placeholder={varName === 'password' ? '******' : 'email@example.com'}
        type={varName === 'password' ? 'password' : undefined}
        helperText={error}
      />
    </div>
  );

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  });

  const renderToast = () : JSX.Element => {
    return(
      <Toast
          snackbarProps={{
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
          }}
          type={toastType}
          showDismissButton
          >
          <div>
              {toastMessage}
          </div>
      </Toast>);
  }

  if (!sessionLoading && session) router.push('/');
  if (!sessionLoading && !session)
    return (
      <Layout title="Sign In">
        {toastMessage.length > 0 ? renderToast() : null}
        <div className={styles.root}>
          <div className={styles.content}>
            <div className={styles.titles}>
              <Typography variant="h3">Welcome Back!</Typography>
              <Typography variant="h5">Sign In</Typography>
            </div>
            <form onSubmit={formik.handleSubmit}>
              {errorBanner ? (
                <div className={styles.errorBanner}>{errorBanner}</div>
              ) : null}
              <div className={styles.fields}>
                {constructRow(
                  'email',
                  formik.handleChange,
                  formik.errors.email
                )}
                {constructRow(
                  'password',
                  formik.handleChange,
                  formik.errors.password
                )}
                <div>
                  <Link href="/users/forgot-password">
                    <a className={styles.link}>
                      <Typography variant="caption">
                        Forgot your password?
                      </Typography>
                    </a>
                  </Link>
                </div>
                <div className={`${styles.field} ${styles.actions}`}>
                  <Link href="/signup">
                    <a className={styles.link}>
                      <Typography variant="caption">
                        Not Registered? Sign Up
                      </Typography>
                    </a>
                  </Link>
                  <div className={styles.submitButton}>
                    <Button variant="contained" color="primary" type="submit">
                      Log In
                    </Button>
                    {formik.isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={styles.submitProgress}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default UserSignIn;
