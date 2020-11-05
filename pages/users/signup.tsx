// import { csrfToken, signIn } from 'next-auth/client';
// import { NextPageContext, GetStaticProps } from 'next';
import { Box } from '@material-ui/core';
import { useFormik, FormikErrors } from 'formik';
import CreateError from 'utils/error';
import { useRouter } from 'next/router';
import SignupSchema from 'interfaces/signup';
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

// CALVIN: TODO
// 1. Look into other ways to use Formik
// 2. Make validations respond on screen
// 3. Make designs look correct
// 4. Check for correct post request

const UserSignUp: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (values: FormValues): Promise<any> => {
    // Validate body
    const { error } = SignupSchema.validate(values);
    console.log(values);
    console.log(error);
    if (error) {
      return error;
    }

    // Make post request
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });
    if (!res.ok) {
      return new Error('Cannot make new user.');
    }
    // console.log('Error :(');
    // Redirect to dashboard
    router.push('/admin/applications');
    return res;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    // Need to make post request, and on success, redirect to home page.
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.wrapper}>
        <div className={styles.titles}>
          <h1>Join Us!</h1>
          <h2>Add your organization!</h2>
        </div>
        <div className={styles.entries}>
          <Box>
            <label className={styles.entryName} htmlFor="email">
              * Email
              <input
                className={styles.entryInput}
                onChange={formik.handleChange}
                name="email"
                type="text"
              />
            </label>
          </Box>
          <Box>
            <label className={styles.entryName} htmlFor="password">
              * Password
              <input
                className={styles.entryInput}
                onChange={formik.handleChange}
                name="password"
                type="password"
              />
            </label>
          </Box>
          <Box>
            <label className={styles.entryName} htmlFor="confirmPassword">
              * Confirm Password
              <input
                className={styles.entryInput}
                onChange={formik.handleChange}
                name="confirmPassword"
                type="password"
              />
            </label>
          </Box>
        </div>
        <div className={styles.buttons}>
          <a className={styles.login} href="/protected">
            Already Registered? Log in
          </a>
          <button type="submit">Create</button>
        </div>
      </div>
    </form>
  );
};

export default UserSignUp;
