import { TextField, Button } from '@material-ui/core';
import {
  FieldArray,
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
  addNewProj: (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue']
  ) => void;
  deleteProj: (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    index: number
  ) => void;
  readOnly: boolean;
};

// Replace later
type Project = {
  title: string;
  description: string;
};

type ProjectTouched = {
  title: boolean;
  description: boolean;
  readOnly: boolean;
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
  readOnly,
}) => {
  // Need this for weird validation bug
  let touchedProjs: ProjectTouched[];
  if (touched.projects) {
    touchedProjs = touched.projects as ProjectTouched[];
  }
  return (
    <FieldArray
      name="projects"
      validateOnChange={false}
      render={(arrayHelpers) => {
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
                    // eslint-disable-next-line react/no-array-index-key
                    <div className={styles.row} key={index}>
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
                        error={Boolean(
                          touchedProjs &&
                            touchedProjs[index]?.title &&
                            errors.projects
                        )}
                        helperText={
                          touchedProjs &&
                          touchedProjs[index]?.title &&
                          errors.projects
                            ? errors.projects
                            : undefined
                        }
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
                        error={Boolean(
                          touchedProjs &&
                            touchedProjs[index]?.description &&
                            errors.projects
                        )}
                        helperText={
                          touchedProjs &&
                          touchedProjs[index]?.description &&
                          errors.projects
                            ? errors.projects
                            : undefined
                        }
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
