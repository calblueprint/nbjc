import { useState } from 'react';
import Link from 'next/link';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { Formik, Form, FormikHandlers, FormikHelpers } from 'formik';
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

type ErrorValues = {
  email?: string;
  password?: string;
  confirmPassword?: string;
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
        }),
      });

      // Check if email exists
      if (!res.ok) {
        const { error } = await res.json();
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
  const validate = (values: FormValues): ErrorValues => {
    const errors: { [k: string]: string } = {};
    const { error } = signupSchema.validate(values, {
      abortEarly: false,
    });

    // Fill out the errors payload with the correct messaging
    if (error) {
      for (let i = 0; i < error.details.length; i += 1) {
        const val = error.details[i];
        errors[val.path[0]] = val.message;
      }
    }
    return errors;
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
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validate={validate}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSubmit}
            >
              {({ errors, handleChange, isSubmitting }) => {
                return (
                  <Form>
                    {errorBanner ? (
                      <div className={styles.errorBanner}>{errorBanner}</div>
                    ) : null}
                    <div className={styles.fields}>
                      {constructRow(
                        'Email',
                        'email',
                        handleChange,
                        errors.email
                      )}
                      {constructRow(
                        'Password',
                        'password',
                        handleChange,
                        errors.password
                      )}
                      {constructRow(
                        'Confirm Password',
                        'confirmPassword',
                        handleChange,
                        errors.confirmPassword
                      )}
                      <div className={`${styles.field} ${styles.actions}`}>
                        <Link href="/users/signin">
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
                            disabled={isSubmitting}
                          >
                            Create
                          </Button>
                          {isSubmitting && (
                            <CircularProgress
                              size={24}
                              className={styles.submitProgress}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default UserSignUp;
