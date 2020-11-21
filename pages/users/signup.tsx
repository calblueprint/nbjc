import { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Formik, Form, FormikHandlers } from 'formik';
import SignupSchema from 'interfaces/signup';
import Layout from 'components/Layout';
import { signIn } from 'next-auth/client';
import CreateError from 'utils/error';
import styles from '../../styles/users/Signup.module.css';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorValues {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// UserSignUp page. Will need additional email verification to be able to create organizations.
const UserSignUp: React.FC = () => {
  // const [emailExists, setEmailExists] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  const handleSubmit = async (values: FormValues): Promise<void> => {
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
      setErrorBanner(
        'Email exists. Sign in with this email or sign up with a different email.'
      );
      return;
    }

    // Sign in user
    try {
      signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
    } catch {
      // Not sure if this error will ever appear, and if so, not something the user can do about it.
      setErrorBanner('Could not sign you in after logging in.');
    }
  };

  // Validates inputs
  const validate = (values: FormValues): ErrorValues => {
    const errors: { [k: string]: string } = {};
    const { error } = SignupSchema.validate(values, {
      context: { strict: true },
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
    varName: string,
    handleChange: FormikHandlers['handleChange'],
    error?: string
  ): JSX.Element => (
    <>
      <Grid item xs={6}>
        <div className={styles.entryName}>* {title}</div>
      </Grid>
      <Grid item xs={6}>
        <TextField
          className={styles.entryField}
          size="small"
          error={Boolean(error)}
          name={varName}
          variant="outlined"
          onChange={handleChange}
          id={varName}
          label={title}
          type={
            varName === 'password' || varName === 'confirmPassword'
              ? 'password'
              : undefined
          }
          helperText={error}
        />
      </Grid>
    </>
  );

  return (
    <Layout title="Sign Up">
      <div className={styles.wrapper}>
        <div className={styles.titles}>
          <h1>Join Us!</h1>
          <h2>Add your organization!</h2>
          &nbsp;
        </div>
        <div className={styles.entries}>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ errors, handleChange }) => {
              return (
                <Form>
                  {errorBanner ? (
                    <>
                      <div className={styles.errorBanner}>{errorBanner}</div>
                      &nbsp;
                    </>
                  ) : null}
                  <Grid container spacing={2}>
                    {constructRow('Email', 'email', handleChange, errors.email)}
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
                    <Grid item xs={6}>
                      <a className={styles.login} href="/users/signin">
                        Already Registered? Log in
                      </a>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                        disableElevation
                        className={styles.submit}
                        type="submit"
                      >
                        Create
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default UserSignUp;
