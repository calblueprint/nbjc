import { TextField } from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { Form } from 'interfaces';
import styles from './TabShortResponse.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touch: FormikTouched<Form>;
  errors: FormikErrors<Form>;
};

const requiredError = '*Required';

const TabShortResponse: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touch,
  errors,
  values,
}) => {
  const touched = touch;
  const rowSize = 6;
  const placeholderText = 'Your short response';
  return (
    <>
      <div className={styles.row}>
        <p>Short 1</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.short1}
          name="short1"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.short1 && errors.short1)}
          helperText={touched.short1 ? errors.short1 : undefined}
        />
      </div>
      <div className={styles.row}>
        <p>Short 2</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.short2}
          name="short2"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.short2 && errors.short2)}
          helperText={touched.short2 ? errors.short2 : undefined}
        />
      </div>
      <div className={styles.row}>
        <p>Short 3</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.short3}
          name="short3"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.short3 && errors.short3)}
          helperText={touched.short3 ? errors.short3 : undefined}
        />
      </div>
    </>
  );
};

export default TabShortResponse;
