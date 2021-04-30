import {
    Checkbox,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import {
    FormikErrors,
    FormikHandlers,
    FormikHelpers,
    FormikTouched,
} from 'formik';
import { BasicInfoForm } from 'interfaces/profile';
import styles from './ProfileBasics.module.css';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
type SectionProps = {
    values: BasicInfoForm,
    handleChange: FormikHandlers['handleChange'],
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    handleBlur: FormikHandlers['handleBlur'],
    touched: FormikTouched<BasicInfoForm>,
    errors: FormikErrors<BasicInfoForm>,
    editing: Boolean,
}

const ProfileBasics: React.FC<SectionProps> = ({
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    touched,
    errors,
    editing,
}) => {
    //TO-DO replace founding date input with date time picker
    return (
        <div>
            <div className={styles.row}>
                <div>Address</div>
                {
                    editing ?
                    <TextField
                    id="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    value={values.address}
                    name="address"
                    variant="outlined"
                    size="small"
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address ? errors.address : undefined}
                    /> : 
                    <div>{values.address}</div>
                }
            </div>

            <div className={styles.row}>
                <div>Website</div>
                {
                    editing ? 
                    <TextField
                    id="website"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    value={values.website}
                    name="website"
                    variant="outlined"
                    size="small"
                    error={Boolean(touched.website && errors.website)}
                    helperText={touched.website ? errors.website : undefined}
                    /> : 
                    <div>{values.website}</div>
                }
            </div>

            <div className={styles.row}>
                <div>EIN</div>
                {
                    editing ? 
                    <TextField
                    id="ein"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    value={values.ein}
                    name="ein"
                    variant="outlined"
                    size="small"
                    error={Boolean(touched.ein && errors.ein)}
                    helperText={touched.ein ? errors.ein : undefined}
                    /> : 
                    <div>{values.ein}</div>
                }
            </div>

            <div className={styles.row}>
                <div>Contact Email</div>
                {
                    editing ?
                    <TextField
                    id="contactEmail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    value={values.contactEmail}
                    name="contactEmail"
                    variant="outlined"
                    size="small"
                    error={Boolean(touched.contactEmail && errors.contactEmail)}
                    helperText={touched.contactEmail ? errors.contactEmail : undefined}
                    /> : 
                    <div>{values.contactEmail}</div>
                }
            </div>

            <div className={styles.row}>
                <div>Founding Date</div>
                {
                    editing ?
                    <TextField
                    id="foundingDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="date"
                    value={values.foundingDate}
                    name="foundingDate"
                    variant="outlined"
                    size="small"
                    error={Boolean(touched.foundingDate && errors.foundingDate)}
                    helperText={touched.foundingDate ? errors.foundingDate : undefined}
                    /> : 
                    <div>{values.foundingDate}</div>
                }
            </div>
        </div>
    );
}

export default ProfileBasics;
