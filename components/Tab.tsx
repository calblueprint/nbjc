import { TextField } from '@material-ui/core';
import { FormikHandlers } from 'formik';

type TabProps = {
  handleChange: FormikHandlers['handleChange'];
  // Change this to an external type (probably will be a Prisma type later on)
  values: {
    name: string;
  };
};

const Tab: React.FC<TabProps> = ({ handleChange, values }) => {
  return (
    <>
      <TextField
        id="name"
        name="name"
        onChange={handleChange}
        value={values.name}
      />
    </>
  );
};

export default Tab;
