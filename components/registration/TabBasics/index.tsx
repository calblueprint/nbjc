import { TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
} from 'formik';
import { Form } from 'interfaces';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from './TabBasics.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touch: FormikTouched<Form>;
  errors: FormikErrors<Form>;
};

// TODO: use Prisma enums
const orientation = ['LGBTQ+ (all)', 'SGL', 'Transgender', 'Asexual/Aromantic'];
const ethnicity = [
  'LGBTQ',
  'POC',
  'Black',
  'Pacific Islander',
  'Latinx',
  'Native/Indigenous',
];
const ages = ['All ages', 'Children', 'Teens', 'Adults', 'Seniors'];
const workType = [
  '501(c)(3)',
  'Grassroots/Local',
  'Statewide',
  'National',
  'Other',
];
const orgType = ['Advocacy', 'Direct Service', 'Networking/Social'];

const TabBasics: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touch,
  errors,
  values,
  setFieldValue,
}) => {
  const touched = touch;
  const rowSize = 1;
  const placeholderText = '';
  const requiredError = '*Required';

  // function emailError(): string {
  //   if (errors.contactEmail.indexOf('valid') > -1) {
  //     return '*Invalid Email';
  //   }
  //   return '*Required';
  // }

  // function streetCityError(): React.ReactElement | null {
  //   let empty = true;
  //   let street = null;
  //   let city = null;
  //   if ('street' in touched && touched.street && errors.street) {
  //     empty = false;
  //     street = <div className={styles.errorStreet}>{requiredError}</div>;
  //   } else {
  //     street = <div className={styles.errorStreet} />;
  //   }
  //   if ('city' in touched && touched.city && errors.city) {
  //     empty = false;
  //     city = <div>{requiredError}</div>;
  //   } else {
  //     city = <div />;
  //   }

  //   if (empty) {
  //     return null;
  //   }
  //   return (
  //     <div className={styles.errorGroup}>
  //       {street}
  //       {city}
  //     </div>
  //   );
  // }

  // function stateZipcodeError(): React.ReactElement | null {
  //   let empty = true;
  //   let state = null;
  //   let zipcode = null;
  //   if ('state' in touched && touched.state && errors.state) {
  //     empty = false;
  //     state = <div className={styles.errorState}>{requiredError}</div>;
  //   } else {
  //     state = <div className={styles.errorState} />;
  //   }
  //   if ('zipcode' in touched && touched.zipcode && errors.zipcode) {
  //     empty = false;
  //     zipcode = <div className={styles.errorState}>*Must be a number.</div>;
  //   } else {
  //     zipcode = <div className={styles.errorState} />;
  //   }

  //   if (empty) {
  //     return null;
  //   }
  //   return (
  //     <div className={styles.errorGroup}>
  //       {state}
  //       {zipcode}
  //     </div>
  //   );
  // }

  // function demographicErrors(): React.ReactElement | null {
  //   let empty = true;
  //   let agesError = null;
  //   let orientationError = null;
  //   let ethnicityError = null;
  //   if ('ages' in touched && touched.ages && errors.ages) {
  //     empty = false;
  //     agesError = <div className={styles.errorDemo}>{requiredError}</div>;
  //   } else {
  //     agesError = <div className={styles.errorDemo} />;
  //   }
  //   if ('orientation' in touched && touched.orientation && errors.orientation) {
  //     empty = false;
  //     orientationError = (
  //       <div className={styles.errorDemo}>{requiredError}</div>
  //     );
  //   } else {
  //     orientationError = <div className={styles.errorDemo} />;
  //   }
  //   if ('ethnicity' in touched && touched.ethnicity && errors.ethnicity) {
  //     empty = false;
  //     ethnicityError = <div className={styles.errorDemo}>{requiredError}</div>;
  //   } else {
  //     ethnicityError = <div className={styles.errorDemo} />;
  //   }

  //   if (empty) {
  //     return null;
  //   }
  //   return (
  //     <div className={styles.errorGroup}>
  //       {agesError}
  //       {orientationError}
  //       {ethnicityError}
  //     </div>
  //   );
  // }

  return (
    <>
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Name</p>
        <TextField
          className={styles.textField}
          id="name"
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          value={values.name}
          name="name"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name ? errors.name : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Work Type</p>
        <Autocomplete
          multiple
          id="workType"
          options={workType}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, newValue) => {
            setFieldValue('workType', newValue);
          }}
          onBlur={handleBlur}
          className={styles.selectField}
          renderInput={(params) => (
            <TextField
              {...params}
              onBlur={handleBlur}
              variant="outlined"
              placeholder="Work Type"
              error={Boolean(touched.workType && errors.workType)}
              helperText={touched.workType ? errors.workType : undefined}
            />
          )}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Type</p>
        <Autocomplete
          multiple
          id="organizationType"
          options={orgType}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, newValue) => {
            setFieldValue('organizationType', newValue);
          }}
          onBlur={handleBlur}
          className={styles.selectField}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Org Type"
              error={Boolean(
                touched.organizationType && errors.organizationType
              )}
              helperText={
                touched.organizationType ? errors.organizationType : undefined
              }
            />
          )}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Name</p>
        <TextField
          className={styles.textField}
          id="contactName"
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          value={values.contactName}
          name="contactName"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.contactName && errors.contactName)}
          helperText={touched.contactName ? errors.contactName : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Email</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contactEmail}
          name="contactEmail"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.contactEmail && errors.contactEmail)}
          helperText={touched.contactEmail ? errors.contactEmail : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Website</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.website}
          name="website"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.website && errors.website)}
          helperText={touched.website ? errors.website : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Location Type</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.location}
          name="location"
          variant="outlined"
          rows={rowSize}
          placeholder="location"
          error={Boolean(touched.location && errors.location)}
          helperText={touched.location ? errors.location : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.addressDescriptor}>Address</p>
        <div className={styles.addressBlock}>
          <div className={styles.addressRow}>
            <TextField
              className={styles.street}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.street}
              name="street"
              variant="outlined"
              rows={rowSize}
              placeholder="Street"
              error={Boolean(touched.street && errors.street)}
              helperText={touched.street ? errors.street : undefined}
            />
            <TextField
              className={styles.city}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.city}
              name="city"
              variant="outlined"
              rows={rowSize}
              placeholder="City"
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city ? errors.city : undefined}
            />
          </div>
          <div className={styles.addressRow}>
            <TextField
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.state}
              name="state"
              variant="outlined"
              rows={rowSize}
              placeholder="State"
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state ? errors.state : undefined}
            />
            <TextField
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.zipcode}
              name="zipcode"
              variant="outlined"
              rows={rowSize}
              placeholder="Zipcode"
              error={Boolean(touched.zipcode && errors.zipcode)}
              helperText={touched.zipcode ? errors.zipcode : undefined}
            />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>EIN</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.ein}
          name="ein"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.ein && errors.ein)}
          helperText={touched.ein ? errors.ein : undefined}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Founding Date</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.foundingDate ? values.foundingDate : ''}
          name="foundingDate"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
          error={Boolean(touched.foundingDate && errors.foundingDate)}
          helperText={touched.foundingDate ? errors.foundingDate : undefined}
        />
      </div>
      <div className={styles.short}>
        <p>Audience Demographics</p>
        <div className={styles.auto}>
          <Autocomplete
            multiple
            id="ageDemographic"
            options={ages}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('ageDemographic', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Ages"
                error={Boolean(touched.ageDemographic && errors.ageDemographic)}
                helperText={
                  touched.ageDemographic ? errors.ageDemographic : undefined
                }
              />
            )}
          />
          <Autocomplete
            multiple
            id="lgbtqDemographic"
            options={orientation}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('lgbtqDemographic', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Orientation"
                error={Boolean(
                  touched.lgbtqDemographic && errors.lgbtqDemographic
                )}
                helperText={
                  touched.lgbtqDemographic ? errors.lgbtqDemographic : undefined
                }
              />
            )}
          />
          <Autocomplete
            multiple
            id="raceDemographic"
            options={ethnicity}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('raceDemographic', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Ethnicity"
                error={Boolean(
                  touched.raceDemographic && errors.raceDemographic
                )}
                helperText={
                  touched.raceDemographic ? errors.raceDemographic : undefined
                }
              />
            )}
          />
        </div>
      </div>
      <div className={styles.short}>
        <p>History</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.shortHistory}
          name="shortHistory"
          variant="outlined"
          rows={6}
          multiline
          placeholder={placeholderText}
          error={Boolean(touched.shortHistory && errors.shortHistory)}
          helperText={touched.shortHistory ? errors.shortHistory : undefined}
        />
      </div>
    </>
  );
};

export default TabBasics;
