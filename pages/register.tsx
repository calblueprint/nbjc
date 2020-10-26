import Tab from 'components/Tab';
import { Button } from '@material-ui/core';
import { useFormik } from 'formik';

const Register: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Tab handleChange={formik.handleChange} values={formik.values} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Register;
