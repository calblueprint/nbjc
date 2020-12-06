import { TextField } from '@material-ui/core';
import { ApplicationQuestion } from '@prisma/client';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { Form } from 'interfaces/registration';
import { string } from 'joi';
import styles from './TabShortResponse.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<Form>;
  errors: FormikErrors<Form>;
  appQuestions: ApplicationQuestion[] | null;
};

const TabShortResponse: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touched,
  errors,
  values,
  appQuestions,
}) => {
  const rowSize = 6;
  const placeholderText = 'Your short response';
  function index(question: string): number {
    return values.shortResponses.response.indexOf(question);
  }
  /*
    function idOf(question: string): number | string {
    return values.shortResponses.id[index(question)];
   }
  */
  const questions = appQuestions?.map(function (q) {
    return (
    <div className={styles.row}>
      <p>{q.question}</p>
      <TextField
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.shortResponses.response[index(q.question)]}
        name={q.id.toString()}
        variant="outlined"
        multiline
        rows={rowSize}
        placeholder={
          typeof q.placeholder === 'string' ? q.placeholder : placeholderText
        }
        error={Boolean(
          touched.shortResponses &&
            touched.shortResponses.response &&
            errors.shortResponses &&
            errors.shortResponses.response
        )}
        helperText={
          touched.shortResponses &&
          touched.shortResponses.response &&
          errors.shortResponses
            ? errors.shortResponses.response
            : undefined
        }
      />
    </div>)
  });
  const empty = <div className={styles.empty}>No questions to answer.</div>;
  const shortResponseForm =
    !appQuestions || appQuestions?.length === 0 ? empty : questions;
return <>{shortResponseForm}</>;
};

export default TabShortResponse;
