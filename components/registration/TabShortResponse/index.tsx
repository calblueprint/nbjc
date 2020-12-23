import { TextField } from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { AppQnR, Form } from 'interfaces/registration';
import styles from './TabShortResponse.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<Form>;
  errors: FormikErrors<Form>;
  appQnR: AppQnR;
  readOnly: boolean;
};

const TabShortResponse: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touched,
  errors,
  values,
  appQnR,
  readOnly,
}) => {
  const rowSize = 6;

  if (!appQnR || appQnR?.length === 0)
    return <div className={styles.empty}>No questions to answer.</div>;
  return (
    <>
      {appQnR?.map(
        (q, i): JSX.Element => {
          const qnrErr = errors.qnr && errors.qnr[i];
          return (
            <div key={q.id} className={styles.row}>
              <p>{q.question}</p>
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.qnr[i].response}
                name={`qnr[${i}].response`}
                variant="outlined"
                multiline
                rows={rowSize}
                placeholder={q.placeholder ?? undefined}
                error={Boolean(
                  touched.qnr && touched.qnr[i]?.response && qnrErr
                )}
                helperText={touched.qnr && touched.qnr[i] && qnrErr}
                disabled={readOnly}
              />
            </div>
          );
        }
      )}
    </>
  );
};

export default TabShortResponse;
