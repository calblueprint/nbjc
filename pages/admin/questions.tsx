import { useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { Prisma } from '@prisma/client';
import {
  TableApplicationQuestion,
  tableApplicationQuestionArgs,
} from 'interfaces/admin';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Checkbox,
  Typography,
  CircularProgress,
  DialogActions,
} from '@material-ui/core';
import Layout from 'components/Layout';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { AppQuestionSchema } from 'interfaces/appQuestion';
import parseValidationError from 'utils/parseValidationError';
import { useRouter } from 'next/router';
import getSession from 'utils/getSession';
import styles from '../../styles/admin/Questions.module.css';

type FormValues = Prisma.ApplicationQuestionGetPayload<{
  select: {
    question: true;
    hint: true;
    placeholder: true;
    required: true;
    wordLimit: true;
  };
}>;

type AdminQuestionsIndexProps = {
  questions: TableApplicationQuestion[];
};

const AdminQuestionsIndex: React.FC<AdminQuestionsIndexProps> = ({
  questions,
}) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const closeModal = (
    resetForm: FormikHelpers<FormValues>['resetForm']
  ) => (): void => {
    setOpenModal(false);
    resetForm();
  };

  // Saves a new question
  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ): Promise<void> => {
    const res = await fetch('/api/app/question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
      }),
    });

    if (!res.ok) {
      // TODO: Replace with error toast
      console.log('Failed to save custom question.');
    } else {
      setOpenModal(false);
      router.replace(router.asPath);
    }
    actions.setSubmitting(false);
    // TODO: add success toast
  };

  const validate = (values: FormValues): FormikErrors<FormValues> => {
    const { error } = AppQuestionSchema.validate(values, {
      abortEarly: false,
      context: {
        strict: true,
      },
    });

    return parseValidationError(error);
  };

  const initialValues: FormValues = {
    question: '',
    hint: '',
    placeholder: '',
    required: false,
    wordLimit: null,
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          errors,
          values,
          isSubmitting,
          submitForm,
          resetForm,
        }) => (
          <Dialog
            onClose={closeModal(resetForm)}
            className={styles.newModal}
            fullWidth
            open={openModal}
          >
            <div className={styles.dialogTitle}> Add Question Prompt </div>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <div className={`${styles.dialogRow} ${styles.dialogShort}`}>
                  <Typography variant="subtitle1">Question</Typography>
                  <TextField
                    name="question"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={values.question}
                    onChange={handleChange}
                    error={Boolean(errors.question)}
                    helperText={errors.question}
                    placeholder="The short answer question title"
                  />
                </div>
                <div className={`${styles.dialogRow} ${styles.dialogShort}`}>
                  <Typography variant="subtitle1">Hint</Typography>
                  <TextField
                    name="hint"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={values.hint}
                    onChange={handleChange}
                    error={Boolean(errors.hint)}
                    helperText={errors.hint}
                    placeholder="Any additional information or description about the question"
                  />
                </div>
                <div className={`${styles.dialogRow} ${styles.dialogShort}`}>
                  <Typography variant="subtitle1">Placeholder</Typography>
                  <TextField
                    name="placeholder"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={values.placeholder}
                    onChange={handleChange}
                    error={Boolean(errors.placeholder)}
                    helperText={errors.placeholder}
                    placeholder="Custom placeholder text for the question when the field is empty"
                  />
                </div>
                <div className={`${styles.dialogRow} ${styles.dialogField}`}>
                  <Typography variant="subtitle1" className={styles.descriptor}>
                    Required?
                  </Typography>
                  <div className={styles.field}>
                    <Checkbox
                      name="required"
                      color="primary"
                      checked={values.required}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className={`${styles.dialogRow} ${styles.dialogField}`}>
                  <Typography variant="subtitle1" className={styles.descriptor}>
                    Word Minimum
                  </Typography>
                  <TextField
                    name="wordLimit"
                    variant="outlined"
                    fullWidth
                    type="number"
                    className={styles.field}
                    value={values.wordLimit ?? ''}
                    onChange={handleChange}
                    error={Boolean(errors.wordLimit)}
                    helperText={errors.wordLimit}
                  />
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={closeModal(resetForm)}
              >
                Close
              </Button>
              <div className={styles.saveButton}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    await submitForm();
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                {isSubmitting && (
                  <CircularProgress size={24} className={styles.saveProgress} />
                )}
              </div>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
      <AdminIndex
        page="Question"
        search="Look for a Question"
        addButtonOnClick={() => setOpenModal(true)}
      >
        <AdminTable data={questions} pageType="questions" />
      </AdminIndex>
    </Layout>
  );
};

export default AdminQuestionsIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const questions = await prisma.applicationQuestion.findMany({
        select: tableApplicationQuestionArgs.select,
      });

      return {
        props: { questions },
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
