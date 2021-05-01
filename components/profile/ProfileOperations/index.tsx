import { TextField } from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import styles from './ProfileOperations.module.css';
import { OperationsForm } from 'interfaces/profile';

type SectionProps = {
  values: OperationsForm;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<OperationsForm>;
  errors: FormikErrors<OperationsForm>;
  editing: Boolean;
};

const ProfileOperations: React.FC<SectionProps> = ({
  values,
  handleChange,
  setFieldValue,
  handleBlur,
  touched,
  errors,
  editing,
}) => {
  return (
    <>
      {values.teamMembers?.map((teamMember) => (
        <div className={styles.row}>
          {editing ? (
            <>
              <div>Member</div>
              <div className={styles.memberSection}>
                <TextField
                  id="memberName1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  value={teamMember.name}
                  name="memberName1"
                  variant="outlined"
                  placeholder="First Last"
                  size="small"
                  // error={Boolean(touched.memberName1 && errors.memberName1)}
                  // helperText={
                  //   touched.memberName1 ? errors.memberName1 : undefined
                  // }
                />
                <TextField
                  id="memberTitle1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  value={teamMember.title}
                  placeholder="Title, Pronouns"
                  name="memberTitle1"
                  variant="outlined"
                  size="small"
                  // error={Boolean(touched.memberTitle1 && errors.memberTitle1)}
                  // helperText={
                  //   touched.memberTitle1 ? errors.memberTitle1 : undefined
                  // }
                />
              </div>
            </>
          ) : (
            <div className={styles.memberSection}>
              {teamMember.name !== '' && teamMember.title !== '' && (
                <>
                  <div>Member</div>
                  <div>{teamMember.name}</div>
                  <div>{teamMember.title}</div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ProfileOperations;
