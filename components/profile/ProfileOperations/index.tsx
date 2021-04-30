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
    values: OperationsForm,
    handleChange: FormikHandlers['handleChange'],
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    handleBlur: FormikHandlers['handleBlur'],
    touched: FormikTouched<OperationsForm>,
    errors: FormikErrors<OperationsForm>,
    editing: Boolean,
}

const ProfileOperations: React.FC<SectionProps> = ({
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    touched,
    errors,
    editing
}) => {
    return(
        <div>
            <div className={styles.row}>
                <div>Member</div>
                {editing ?
                <div className={styles.memberSection}>
                    <TextField
                        id="memberName1"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberName1}
                        name="memberName1"
                        variant="outlined"
                        placeholder="First Last"
                        size="small"
                        error={Boolean(touched.memberName1 && errors.memberName1)}
                        helperText={touched.memberName1 ? errors.memberName1 : undefined}
                    />
                    <TextField
                        id="memberTitle1"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberTitle1}
                        placeholder="Title, Pronouns"
                        name="memberTitle1"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberTitle1 && errors.memberTitle1)}
                        helperText={touched.memberTitle1 ? errors.memberTitle1 : undefined}
                    />
                </div>
                : 
                <div className={styles.memberSection}>
                    <div>{values.memberName1}</div>
                    <div>{values.memberTitle1}</div>
                </div>}
            </div>
            <div className={styles.row}>
                <div>Member</div>
                {editing ?
                <div className={styles.memberSection}>
                    <TextField
                        id="memberName2"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberName2}
                        placeholder="First Last"
                        name="memberName2"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberName2 && errors.memberName2)}
                        helperText={touched.memberName2 ? errors.memberName2 : undefined}
                    />
                    <TextField
                        id="memberTitle2"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberTitle2}
                        placeholder="Title, Pronouns"
                        name="memberTitle2"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberTitle2 && errors.memberTitle2)}
                        helperText={touched.memberTitle2 ? errors.memberTitle2 : undefined}
                    />
                </div>
                : 
                <div className={styles.memberSection}>
                    <div>{values.memberName2}</div>
                    <div>{values.memberTitle2}</div>
                </div>}
            </div>
            <div className={styles.row}>
                <div>Member</div>
                {editing ?
                <div className={styles.memberSection}>
                    <TextField
                        id="memberName3"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberName3}
                        placeholder="First Last"
                        name="memberName3"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberName3 && errors.memberName3)}
                        helperText={touched.memberName3 ? errors.memberName3 : undefined}
                    />
                    <TextField
                        id="memberTitle3"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberTitle3}
                        placeholder="Title, Pronouns"
                        name="memberTitle3"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberTitle3 && errors.memberTitle3)}
                        helperText={touched.memberTitle3 ? errors.memberTitle3 : undefined}
                    />
                </div>
                : 
                <div className={styles.memberSection}>
                    <div>{values.memberName3}</div>
                    <div>{values.memberTitle3}</div>
                </div>}
            </div>
            <div className={styles.row}>
                <div>Member</div>
                {editing ?
                <div className={styles.memberSection}>
                    <TextField
                        id="memberName4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberName4}
                        placeholder="First Last"
                        name="memberName4"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberName4 && errors.memberName4)}
                        helperText={touched.memberName4 ? errors.memberName4 : undefined}
                    />
                    <TextField
                        id="memberTitle4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberTitle4}
                        placeholder="Title, Pronouns"
                        name="memberTitle4"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberTitle4 && errors.memberTitle4)}
                        helperText={touched.memberTitle4 ? errors.memberTitle4 : undefined}
                    />
                </div>
                : 
                <div className={styles.memberSection}>
                    <div>{values.memberName4}</div>
                    <div>{values.memberTitle4}</div>
                </div>}
            </div>
            <div className={styles.row}>
                <div>Member</div>
                {editing ?
                <div className={styles.memberSection}>
                    <TextField
                        id="memberName5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberName5}
                        placeholder="First Last"
                        name="memberName5"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberName5 && errors.memberName5)}
                        helperText={touched.memberName5 ? errors.memberName5 : undefined}
                    />
                    <TextField
                        id="memberTitle5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={values.memberTitle5}
                        placeholder="Title, Pronouns"
                        name="memberTitle5"
                        variant="outlined"
                        size="small"
                        error={Boolean(touched.memberTitle5 && errors.memberTitle5)}
                        helperText={touched.memberTitle5 ? errors.memberTitle5 : undefined}
                    />
                </div>
                : 
                <div className={styles.memberSection}>
                    <div>{values.memberName5}</div>
                    <div>{values.memberTitle5}</div>
                </div>}
            </div>
        </div>
    );
};

export default ProfileOperations;