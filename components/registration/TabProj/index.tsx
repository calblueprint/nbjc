import { TextField } from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { Form } from 'interfaces/registration';
import styles from './TabProj.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<Form>;
  errors: FormikErrors<Form>;
};

const TabProj: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touched,
  errors,
  values,
}) => {
  const rowSize = 6;
  const placeholderText = 'Your short response';
  return (
    <>
      <div className={styles.row}>
        <p>Project 1</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.proj1}
          name="proj1"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.proj1 && errors.proj1)}
          helperText={touched.proj1 ? errors.proj1 : undefined}
        />
      </div>
      <div className={styles.row}>
        <p>Project 2</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.proj2}
          name="proj2"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.proj2 && errors.proj2)}
          helperText={touched.proj2 ? errors.proj2 : undefined}
        />
      </div>
      <div className={styles.row}>
        <p>Project 3</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.proj3}
          name="proj3"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.proj3 && errors.proj3)}
          helperText={touched.proj3 ? errors.proj3 : undefined}
        />
      </div>
    </>
  );
};

export default TabProj;
