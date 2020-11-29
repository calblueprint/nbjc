import { signIn, useSession } from 'next-auth/client';
import Link from 'next/link';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { useFormik, FormikHandlers, FormikHelpers } from 'formik';
import { signinSchema } from 'interfaces/auth';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';

type FormValues = {
  email: string;
  password: string;
};

type ErrorValues = {
  email?: string;
  password?: string;
};

// UserSignIn page. Will need additional email verification to be able to create organizations.
const UserSignIn: React.FC = () => {
  // Get URL params for error callbacks.
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const errorBanner = router.query.error;

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
  const validate = (values: FormValues): ErrorValues => {
    const errors: { [k: string]: string } = {};
    const { error } = signinSchema.validate(values, {
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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  });

  if (!sessionLoading && session) router.push('/');
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
