// import { csrfToken, signIn } from 'next-auth/client';
// import { NextPageContext, GetStaticProps } from 'next';

// UserSignUp page. Will need additional email verification to be able to create organizations.
const UserSignUp: React.FC = () => {
  const handleSubmit = (e: any): void => {
    console.log(e.target.value);
  };

  return (
    // Need to make post request, and on success, redirect to home page.
    <form onSubmit={handleSubmit}>
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
};

export default UserSignUp;
