import { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import CreateError from 'utils/error';
import { useRouter } from 'next/router';
import SignupSchema from 'interfaces/signup';
import Layout from 'components/Layout';
import styles from './signup.module.css';

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
  const router = useRouter();
  const [emailExists, setEmailExists] = useState(false);

  const handleSubmit = async (values: FormValues): Promise<any> => {
    // Make post request
    const res: any = await fetch('/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    }).then((response) => {
      if (response.ok) {
        router.push('/');
        return res;
      }
      setEmailExists(true);
      return new Error('Email already exists.');
    });
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
    handleChange: any,
    error?: string
  ): any => (
    <>
      <Grid item xs={4}>
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
                  {emailExists ? (
                    <>
                      <div className={styles.emailExists}>
                        Email exists. Try to join with a different email.
                      </div>
                      &nbsp;
                    </>
                  ) : null}
                  <Grid container xs={9} spacing={2}>
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
                    <Grid item xs={4}>
                      <a className={styles.login} href="/users/signin">
                        Already Registered? Log in
                      </a>
                    </Grid>
                    <Grid item xs={6}>
                      <button className={styles.submit} type="submit">
                        Create
                      </button>
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
