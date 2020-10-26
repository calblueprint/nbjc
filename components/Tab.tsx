import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import { FormikHandlers } from 'formik';
import { Form } from 'interfaces';

type TabProps = {
  handleChange: FormikHandlers['handleChange'];
  values: Form;
};

const Tab: React.FC<TabProps> = ({ handleChange, values }) => {
  console.log(values.age);
  return (
    <>
      <TextField
        id="name"
        name="name"
        onChange={handleChange}
        value={values.name}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select value={values.age} name="age" onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default Tab;
