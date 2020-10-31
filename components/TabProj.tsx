import { TextField } from '@material-ui/core';
import { FormikHandlers } from 'formik';
import { Form } from 'interfaces';
import styles from 'styles/TabShortR.module.css';

type TabProps = {
  handleChange: FormikHandlers['handleChange'];
  values: Form;
};

const TabShortR: React.FC<TabProps> = ({ handleChange, values }) => {
  const rowSize = 6;
  const placeholderText = 'Your short response';
  return (
    <>
      <div className={styles.row}>
        <p>Project 1</p>
        <TextField
          onChange={handleChange}
          value={values.proj1}
          name="proj1"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p>Project 2</p>
        <TextField
          onChange={handleChange}
          value={values.proj2}
          name="proj2"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p>Project 3</p>
        <TextField
          onChange={handleChange}
          value={values.proj3}
          name="proj3"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
    </>
  );
};

export default TabShortR;
