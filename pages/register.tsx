// import { csrfToken, signIn } from 'next-auth/client';
// import { NextPageContext, GetStaticProps } from 'next';

// Register page. Will need additional email verification to be able to create organizations.
const Register: React.FC = () => (
  <form method="post" action="/api/users">
    {/* <input name="csrfToken" type="hidden" /> */}
    <label htmlFor="firstName">
      First Name
      <input name="firstName" type="text" />
    </label>
    <label htmlFor="lastName">
      Last Name
      <input name="lastName" type="text" />
    </label>
    <label htmlFor="email">
      Email
      <input name="email" type="text" />
    </label>
    <label htmlFor="password">
      Password
      <input name="password" type="password" />
    </label>
    <button type="submit">Sign in</button>
  </form>
);

// Not sure how to use csrfToken yet
// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: { csrfToken: await csrfToken() },
//   };
// };

export default Register;

// firstName: data.firstName,
//         lastName: data.lastName,
//         role: data.role,
//         email: data.email,
//         emailVerified: data.emailVerified,
//         image: data.image,
//         hashedPassword: data.hashedPassword,
