import { TextField } from '@material-ui/core';
import { FormikHandlers } from 'formik';
import { Form } from 'interfaces';
import styles from 'styles/TabShortR.module.css';

type TabProps = {
  handleChange: FormikHandlers['handleChange'];
  values: Form;
};

const TabShortResponse: React.FC<TabProps> = ({ handleChange, values }) => {
  const rowSize = 6;
  const placeholderText = 'Your short response';
  return (
    <>
      <div className={styles.row}>
        <p>Short 1</p>
        <TextField
          onChange={handleChange}
          value={values.short1}
          name="short1"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p>Short 2</p>
        <TextField
          onChange={handleChange}
          value={values.short2}
          name="short2"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p>Short 3</p>
        <TextField
          onChange={handleChange}
          value={values.short3}
          name="short3"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
    </>
  );
};

export default TabShortResponse;
