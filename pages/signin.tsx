import { useState } from 'react';
import { signIn } from 'next-auth/client';
import useSession from 'utils/useSession';
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
import signInRedirect from 'utils/signInRedirect';
import styles from '../styles/Auth.module.css';

type FormValues = {
  email: string;
  password: string;
};

// UserSignIn page. Will need additional email verification to be able to create organizations.
const UserSignIn: React.FC = () => {
  // Get URL params for error callbacks.
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [errorBanner, setErrorBanner] = useState('');

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    try {
      // Sign in with credentials
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
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
        autoFocus={varName === 'email'}
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

  if (!sessionLoading && session) signInRedirect(router, session);
  if (!sessionLoading && !session)
    return (
      <Layout title="Sign In">
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
