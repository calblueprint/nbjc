import { csrfToken, signIn } from 'next-auth/client';
// import { NextPageContext, GetStaticProps } from 'next';
import { Grid, TextField } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import CreateError from 'utils/error';
import { useRouter } from 'next/router';
import SigninSchema from 'interfaces/signin';
import Layout from 'components/Layout';
import styles from './signin.module.css';

interface FormValues {
  email: string;
  password: string;
}

interface ErrorValues {
  email?: string;
  password?: string;
}

// UserSignUp page. Will need additional email verification to be able to create organizations.
const UserSignUp: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (values: FormValues): Promise<any> => {
    // Sign in with credentials
    try {
      signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: 'http://localhost:3000',
      });
    } catch {
      console.log('error');
    }
  };

  // Validates inputs
  const validate = (values: FormValues): ErrorValues => {
    const errors: { [k: string]: string } = {};
    const { error } = SigninSchema.validate(values, {
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
    varName: string,
    handleChange: any,
    error?: string
  ): any => (
    <>
      <Grid item xs={4}>
        <div className={styles.entryName}>{varName}</div>
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
          label={varName}
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
          <h1>Welcome Back!</h1>
          <h2>Organization Log In</h2>
          &nbsp;
        </div>
        <div className={styles.entries}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values) => {
              console.log(values);
              handleSubmit(values);
            }}
          >
            {({ errors, handleChange }) => {
              return (
                <Form>
                  <Grid container xs={9} spacing={3}>
                    {constructRow('email', handleChange, errors.email)}
                    {constructRow('password', handleChange, errors.password)}
                    <Grid item xs={4}>
                      <a className={styles.login} href="/users/signup">
                        Not Registered? Sign Up
                      </a>
                    </Grid>
                    <Grid item xs={6}>
                      <button className={styles.submit} type="submit">
                        Log In
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
