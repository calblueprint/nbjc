import { TextField, Button } from '@material-ui/core';
import {
  FieldArray,
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { Form } from 'interfaces/registration';
import { useState } from 'react';
import styles from './TabProj.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<Form>;
  errors: FormikErrors<Form>;
  addNewProj: (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue']
  ) => void;
  deleteProj: (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    index: number
  ) => void;
};

// Replace later
type Project = {
  title: string;
  description: string;
};

const TabProj: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  setFieldValue,
  touched,
  errors,
  values,
  addNewProj,
  deleteProj,
}) => {
  return (
    <FieldArray
      name="projects"
      render={(arrayHelpers) => {
        console.log(values);
        return (
          <>
            <Button
              className={styles.addButton}
              variant="contained"
              color="primary"
              // Below logic would have been ideal, but not working for some reason.
              // onClick={() => arrayHelpers.push({ title: '', description: '' })}
              onClick={() => addNewProj(values, setFieldValue)}
            >
              Add New
            </Button>
            <div>
              {values.projects && values.projects.length > 0
                ? values.projects.map((project, index) => (
                    <div className={styles.row}>
                      <div className={styles.rowEntry}>
                        <p>Project or Event Name</p>
                        {/* <Button onClick={() => arrayHelpers.remove(index)}> */}
                        <Button
                          className={styles.deleteButton}
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            deleteProj(values, setFieldValue, index)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                      <TextField
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={project.title}
                        name={`projects.${index}.title`}
                        variant="outlined"
                        multiline
                        rows={6}
                        placeholder="i.e. Annual Gala Three!"
                        // error={Boolean(touched.proj1 && errors.proj1)}
                        // helperText={touched.proj1 ? errors.proj1 : undefined}
                      />
                      <p>Description</p>
                      <TextField
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={project.description}
                        name={`projects.${index}.description`}
                        variant="outlined"
                        multiline
                        rows={6}
                        placeholder="Your short response"
                        // error={Boolean(touched.proj1 && errors.proj1)}
                        // helperText={touched.proj1 ? errors.proj1 : undefined}
                      />
                    </div>
                  ))
                : null}
            </div>
          </>
        );
      }}
    />
  );
};

export default TabProj;
