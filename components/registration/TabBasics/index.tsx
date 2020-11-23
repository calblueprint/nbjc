import { TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import { FormikHandlers, FormikHelpers } from 'formik';
import { Form } from 'interfaces';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from './TabBasics.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touch: Array<{ [field: string]: boolean }[]>;
  formikErrors: Array<{ [field: string]: string }>;
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
  formikErrors,
  values,
  setFieldValue,
}) => {
  const touched = touch;
  const errors = formikErrors;
  const rowSize = 1;
  const placeholderText = '';
  const requiredError = '*Required';

  function emailError(): string {
    if (errors.contactEmail.indexOf('valid') > -1) {
      return '*Invalid Email';
    }
    return '*Required';
  }

  function streetCityError(): React.ReactElement | null {
    let empty = true;
    let street = null;
    let city = null;
    if ('street' in touched && touched.street && errors.street) {
      empty = false;
      street = <div className={styles.errorStreet}>{requiredError}</div>;
    } else {
      street = <div className={styles.errorStreet} />;
    }
    if ('city' in touched && touched.city && errors.city) {
      empty = false;
      city = <div>{requiredError}</div>;
    } else {
      city = <div />;
    }

    if (empty) {
      return null;
    }
    return (
      <div className={styles.errorGroup}>
        {street}
        {city}
      </div>
    );
  }

  function stateZipcodeError(): React.ReactElement | null {
    let empty = true;
    let state = null;
    let zipcode = null;
    if ('state' in touched && touched.state && errors.state) {
      empty = false;
      state = <div className={styles.errorState}>{requiredError}</div>;
    } else {
      state = <div className={styles.errorState} />;
    }
    if ('zipcode' in touched && touched.zipcode && errors.zipcode) {
      empty = false;
      zipcode = <div className={styles.errorState}>*Must be a number.</div>;
    } else {
      zipcode = <div className={styles.errorState} />;
    }

    if (empty) {
      return null;
    }
    return (
      <div className={styles.errorGroup}>
        {state}
        {zipcode}
      </div>
    );
  }

  function demographicErrors(): React.ReactElement | null {
    let empty = true;
    let agesError = null;
    let orientationError = null;
    let ethnicityError = null;
    if ('ages' in touched && touched.ages && errors.ages) {
      empty = false;
      agesError = <div className={styles.errorDemo}>{requiredError}</div>;
    } else {
      agesError = <div className={styles.errorDemo} />;
    }
    if ('orientation' in touched && touched.orientation && errors.orientation) {
      empty = false;
      orientationError = (
        <div className={styles.errorDemo}>{requiredError}</div>
      );
    } else {
      orientationError = <div className={styles.errorDemo} />;
    }
    if ('ethnicity' in touched && touched.ethnicity && errors.ethnicity) {
      empty = false;
      ethnicityError = <div className={styles.errorDemo}>{requiredError}</div>;
    } else {
      ethnicityError = <div className={styles.errorDemo} />;
    }

    if (empty) {
      return null;
    }
    return (
      <div className={styles.errorGroup}>
        {agesError}
        {orientationError}
        {ethnicityError}
      </div>
    );
  }

  return (
    <>
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Name</p>
        <TextField
          error={'orgName' in touched && touched.orgName && errors.orgName}
          className={styles.textField}
          id="orgName"
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          value={values.orgName}
          name="orgName"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'orgName' in touched && touched.orgName && errors.orgName ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
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
              error={
                'workType' in touched && touched.workType && errors.workType
              }
            />
          )}
        />
      </div>
      {'workType' in touched && touched.workType && errors.workType ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Type</p>
        <Autocomplete
          multiple
          id="orgType"
          options={orgType}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, newValue) => {
            setFieldValue('orgType', newValue);
          }}
          onBlur={handleBlur}
          className={styles.selectField}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Org Type"
              error={'orgType' in touched && touched.orgType && errors.orgType}
            />
          )}
        />
      </div>
      {'orgType' in touched && touched.orgType && errors.orgType ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
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
          error={
            'contactName' in touched &&
            touched.contactName &&
            errors.contactName
          }
        />
      </div>
      {'contactName' in touched && touched.contactName && errors.contactName ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Email</p>
        <TextField
          error={
            'contactEmail' in touched &&
            touched.contactEmail &&
            errors.contactEmail
          }
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contactEmail}
          name="contactEmail"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'contactEmail' in touched &&
      touched.contactEmail &&
      errors.contactEmail ? (
        <div className={styles.errorMsg}>{emailError()}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Website</p>
        <TextField
          error={'website' in touched && touched.website && errors.website}
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.website}
          name="website"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'website' in touched && touched.website && errors.website ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Location Type</p>
        <TextField
          error={'location' in touched && touched.location && errors.location}
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.location}
          name="location"
          variant="outlined"
          rows={rowSize}
          placeholder="location"
        />
      </div>
      {'location' in touched && touched.location && errors.location ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.addressDescriptor}>Address</p>
        <div className={styles.addressBlock}>
          <div className={styles.addressRow}>
            <TextField
              error={'street' in touched && touched.street && errors.street}
              className={styles.street}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.street}
              name="street"
              variant="outlined"
              rows={rowSize}
              placeholder="Street"
            />
            <TextField
              error={'city' in touched && touched.city && errors.city}
              className={styles.city}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.city}
              name="city"
              variant="outlined"
              rows={rowSize}
              placeholder="City"
            />
          </div>
          {streetCityError()}
          <div className={styles.addressRow}>
            <TextField
              error={'state' in touched && touched.state && errors.state}
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.state}
              name="state"
              variant="outlined"
              rows={rowSize}
              placeholder="State"
            />
            <TextField
              error={'zipcode' in touched && touched.zipcode && errors.zipcode}
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.zipcode}
              name="zipcode"
              variant="outlined"
              rows={rowSize}
              placeholder="Zipcode"
            />
          </div>
          {stateZipcodeError()}
        </div>
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>EIN</p>
        <TextField
          error={'EIN' in touched && touched.EIN && errors.EIN}
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.EIN}
          name="EIN"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'EIN' in touched && touched.EIN && errors.EIN ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Founding Date</p>
        <TextField
          error={
            'foundingDate' in touched &&
            touched.foundingDate &&
            errors.foundingDate
          }
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.foundingDate}
          name="foundingDate"
          variant="outlined"
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'foundingDate' in touched &&
      touched.foundingDate &&
      errors.foundingDate ? (
        <div className={styles.errorMsg}>{requiredError}</div>
      ) : null}
      <div className={styles.short}>
        <p>Audience Demographics</p>
        <div className={styles.auto}>
          <Autocomplete
            multiple
            id="ages"
            options={ages}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('ages', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Ages"
                onBlur={handleBlur}
                error={'ages' in touched && touched.ages && errors.ages}
              />
            )}
          />
          <Autocomplete
            multiple
            id="orientation"
            options={orientation}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('orientation', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                error={
                  'orientation' in touched &&
                  touched.orientation &&
                  errors.orientation
                }
                {...params}
                variant="outlined"
                placeholder="Orientation"
                onBlur={handleBlur}
              />
            )}
          />
          <Autocomplete
            multiple
            id="ethnicity"
            options={ethnicity}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('ethnicity', newValue);
            }}
            onBlur={handleBlur}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                error={
                  'ethnicity' in touched &&
                  touched.ethnicity &&
                  errors.ethnicity
                }
                {...params}
                variant="outlined"
                placeholder="Ethnicity"
                onBlur={handleBlur}
              />
            )}
          />
        </div>
        {demographicErrors()}
      </div>
      <div className={styles.short}>
        <p>Mission History</p>
        <TextField
          error={
            'missionHistory' in touched &&
            touched.missionHistory &&
            errors.missionHistory
          }
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.missionHistory}
          name="missionHistory"
          variant="outlined"
          rows={6}
          placeholder={placeholderText}
        />
        {'missionHistory' in touched &&
        touched.missionHistory &&
        errors.missionHistory ? (
          <div className={styles.errorPara}>{requiredError}</div>
        ) : null}
      </div>
    </>
  );
};

export default TabBasics;
