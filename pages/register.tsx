import Tab from 'components/Tab';
import { Button } from '@material-ui/core';
import { useFormik } from 'formik';
import { Form } from 'interfaces';

const Register: React.FC = () => {
  const initialValues: Form = { name: '', age: '' };
  const formik = useFormik({
    initialValues,
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
