import { TextField } from '@material-ui/core';
import { FormikHandlers } from 'formik';
import { Form } from 'interfaces';
import styles from './TabShortResponse.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touch: Array<{ [field: string]: boolean }[]>;
  formikErrors: Array<{ [field: string]: string }>;
};

const TabShortResponse: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touch,
  formikErrors,
  values,
}) => {
  const touched = touch;
  const errors = formikErrors;
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
        />
        {'short1' in touched && touched.short1 && errors.short1 ? (
          <div className={styles.errorPara}>{errors.short1}</div>
        ) : null}
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
        />
        {'short2' in touched && touched.short2 && errors.short2 ? (
          <div className={styles.errorPara}>{errors.short2}</div>
        ) : null}
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
        />
        {'short3' in touched && touched.short3 && errors.short3 ? (
          <div className={styles.errorPara}>{errors.short3}</div>
        ) : null}
      </div>
    </>
  );
};

export default TabShortResponse;
