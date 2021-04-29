import { useState } from 'react';
import Link from 'next/link';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { useFormik, FormikHandlers, FormikHelpers, FormikErrors } from 'formik';
import { signupSchema } from 'interfaces/auth';
import Layout from 'components/Layout';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

// UserSignUp page. Will need additional email verification to be able to create organizations.
const UserSignUp: React.FC = () => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [errorBanner, setErrorBanner] = useState('');

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    try {
      // Make post request
      const res = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          role: 'organization',
        }),
      });

      // Check if email exists
      if (!res.ok) {
        const { error } = await res.json();
        throw error;
      }

      // Send a verification email
      const verificationRes = await fetch('/api/emailVerification', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          email: values.email
        })
      });

      if (!verificationRes.ok) {
        const { error } = await verificationRes.json();
        throw error;
      }

      // Sign in user
      signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
    } catch (err) {
      if (err.errorCode === 'DUP_EMAIL') {
        setErrorBanner(
          'Email exists. Sign in with this email or sign up with a different email.'
        );
      } else {
        setErrorBanner('Failed to sign up. Please try again.');
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Validates inputs
  const validate = (values: FormValues): FormikErrors<FormValues> => {
    const { error } = signupSchema.validate(values, {
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
    title: string,
    varName: 'email' | 'password' | 'confirmPassword',
    handleChange: FormikHandlers['handleChange'],
    error?: string
  ): JSX.Element => (
    <div className={styles.field}>
      <div className={styles.entryName}>
        <Typography>{title}</Typography>
      </div>
      <TextField
        className={styles.textField}
        size="small"
        error={Boolean(error)}
        name={varName}
        variant="outlined"
        onChange={handleChange}
        id={varName}
        placeholder={
          varName === 'password' || varName === 'confirmPassword'
            ? '******'
            : 'email@example.com'
        }
        type={
          varName === 'password' || varName === 'confirmPassword'
            ? 'password'
            : undefined
        }
        helperText={error}
      />
    </div>
  );

  const initialValues: FormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  });

  if (!sessionLoading && session) router.push('/');
  if (!sessionLoading && !session)
    return (
      <Layout title="Sign Up">
        <div className={styles.root}>
          <div className={styles.content}>
            <div className={styles.titles}>
              <Typography variant="h3">Join Us!</Typography>
              <Typography variant="h5">Add your organization!</Typography>
            </div>
            <form onSubmit={formik.handleSubmit}>
              {errorBanner ? (
                <div className={styles.errorBanner}>{errorBanner}</div>
              ) : null}
              <div className={styles.fields}>
                {constructRow(
                  'Email',
                  'email',
                  formik.handleChange,
                  formik.errors.email
                )}
                {constructRow(
                  'Password',
                  'password',
                  formik.handleChange,
                  formik.errors.password
                )}
                {constructRow(
                  'Confirm Password',
                  'confirmPassword',
                  formik.handleChange,
                  formik.errors.confirmPassword
                )}
                <div className={`${styles.field} ${styles.actions}`}>
                  <Link href="/signin">
                    <a className={styles.link}>
                      <Typography variant="caption">
                        Already Registered? Log in
                      </Typography>
                    </a>
                  </Link>
                  <div className={styles.submitButton}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      Create
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

export default UserSignUp;
