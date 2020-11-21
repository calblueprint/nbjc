import { signIn } from 'next-auth/client';
import { Grid, TextField, Button } from '@material-ui/core';
import { Formik, Form, FormikHandlers } from 'formik';
import SigninSchema from 'interfaces/signin';
import Layout from 'components/Layout';
import styles from '../../styles/users/Signin.module.css';

interface FormValues {
  email: string;
  password: string;
}

interface ErrorValues {
  email?: string;
  password?: string;
}

// UserSignIn page. Will need additional email verification to be able to create organizations.
const UserSignIn: React.FC = () => {
  const handleSubmit = async (values: FormValues): Promise<void> => {
    // Sign in with credentials
    try {
      signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
      });
    } catch {
      throw new Error('Could not sign in.');
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
    handleChange: FormikHandlers['handleChange'],
    error?: string
  ): JSX.Element => (
    <>
      <Grid item xs={6}>
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
    <Layout title="Sign In">
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
              handleSubmit(values);
            }}
          >
            {({ errors, handleChange }) => {
              return (
                <Form>
                  <Grid container spacing={4}>
                    {constructRow('email', handleChange, errors.email)}
                    {constructRow('password', handleChange, errors.password)}
                    <Grid item xs={6}>
                      <a className={styles.login} href="/users/signup">
                        Not Registered? Sign Up
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
                        Log In
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

export default UserSignIn;
