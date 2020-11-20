import { TextField } from '@material-ui/core';
import { FormikHandlers, FormikHelpers } from 'formik';
import { Form } from 'interfaces';
import styles from './TabProj.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touch: Array<{ [field: string]: boolean }[]>;
  formikErrors: Array<{ [field: string]: string }>;
};

const TabProj: React.FC<TabProps> = ({
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
        />
        {'proj1' in touched && touched.proj1 && errors.proj1 ? (
          <div className={styles.errorPara}>{errors.proj1}</div>
        ) : null}
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
        />
        {'proj2' in touched && touched.proj2 && errors.proj2 ? (
          <div className={styles.errorPara}>{errors.proj2}</div>
        ) : null}
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
        />
        {'proj3' in touched && touched.proj3 && errors.proj3 ? (
          <div className={styles.errorPara}>{errors.proj3}</div>
        ) : null}
      </div>
    </>
  );
};

export default TabProj;
