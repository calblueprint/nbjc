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

  function streetCityError(): React.ReactElement | null {
    if ('street' in touched && touched.street && errors.street) {
      if ('city' in touched && touched.city && errors.city) {
        return (
          <div className={styles.errorGroup}>
            <div className={styles.errorStreet}>{errors.street}</div>
            <div className={styles.errorCity}>{errors.city}</div>
          </div>
        );
      }
      return <div className={styles.errorStreet}>{errors.street}</div>;
    }
    if ('city' in touched && touched.city && errors.city) {
      return (
        <div className={styles.errorGroup}>
          <div className={styles.errorStreet} />
          <div className={styles.errorCity}>{errors.city}</div>
        </div>
      );
    }
    return null;
  }

  function stateZipcodeError(): React.ReactElement | null {
    if ('state' in touched && touched.state && errors.state) {
      if ('zipcode' in touched && touched.zipcode && errors.zipcode) {
        return (
          <div className={styles.errorGroup}>
            <div className={styles.errorState}>{errors.state}</div>
            <div className={styles.errorZipcode}>{errors.zipcode}</div>
          </div>
        );
      }
      return <div className={styles.errorState}>{errors.state}</div>;
    }
    if ('zipcode' in touched && touched.zipcode && errors.zipcode) {
      return (
        <div className={styles.errorGroup}>
          <div className={styles.errorState} />
          <div className={styles.errorZipcode}>{errors.zipcode}</div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Name</p>
        <TextField
          className={styles.textField}
          id="orgName"
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          value={values.orgName}
          name="orgName"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'orgName' in touched && touched.orgName && errors.orgName ? (
        <div className={styles.errorMsg}>{errors.orgName}</div>
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
            />
          )}
        />
      </div>
      {'workType' in touched && touched.workType && errors.workType ? (
        <div className={styles.errorMsg}>{errors.workType}</div>
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
            <TextField {...params} variant="outlined" placeholder="Org Type" />
          )}
        />
      </div>
      {'orgType' in touched && touched.orgType && errors.orgType ? (
        <div className={styles.errorMsg}>{errors.orgType}</div>
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
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'contactName' in touched && touched.contactName && errors.contactName ? (
        <div className={styles.errorMsg}>{errors.contactName}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Email</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contactEmail}
          name="contactEmail"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'contactEmail' in touched &&
      touched.contactEmail &&
      errors.contactEmail ? (
        <div className={styles.errorMsg}>{errors.contactEmail}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Website</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.website}
          name="website"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'website' in touched && touched.website && errors.website ? (
        <div className={styles.errorMsg}>{errors.website}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>Location Type</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.location}
          name="location"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder="location"
        />
      </div>
      {'location' in touched && touched.location && errors.location ? (
        <div className={styles.errorMsg}>{errors.location}</div>
      ) : null}
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
              multiline
              rows={rowSize}
              placeholder="Street"
            />
            <TextField
              className={styles.city}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.city}
              name="city"
              variant="outlined"
              multiline
              rows={rowSize}
              placeholder="City"
            />
          </div>
          {streetCityError()}
          <div className={styles.addressRow}>
            <TextField
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.state}
              name="state"
              variant="outlined"
              multiline
              rows={rowSize}
              placeholder="State"
            />
            <TextField
              className={styles.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.zipcode}
              name="zipcode"
              variant="outlined"
              multiline
              rows={rowSize}
              placeholder="Zipcode"
            />
          </div>
          {stateZipcodeError()}
        </div>
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>EIN</p>
        <FormControl variant="outlined" className={styles.selectField}>
          <Select
            value={values.EIN}
            name="EIN"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>EIN 1</MenuItem>
            <MenuItem value={20}>EIN 2</MenuItem>
            <MenuItem value={30}>EIN 3</MenuItem>
          </Select>
        </FormControl>
      </div>
      {'EIN' in touched && touched.EIN && errors.EIN ? (
        <div className={styles.errorMsg}>{errors.EIN}</div>
      ) : null}
      <div className={styles.row}>
        <p className={styles.descriptor}>founding Date</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.foundingDate}
          name="foundingDate"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      {'foundingDate' in touched &&
      touched.foundingDate &&
      errors.foundingDate ? (
        <div className={styles.errorMsg}>{errors.foundingDate}</div>
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
                {...params}
                variant="outlined"
                placeholder="Ethnicity"
                onBlur={handleBlur}
              />
            )}
          />
        </div>
      </div>
      <div className={styles.short}>
        <p>Mission History</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.missionHistory}
          name="missionHistory"
          variant="outlined"
          multiline
          rows={6}
          placeholder={placeholderText}
        />
      </div>
    </>
  );
};

export default TabBasics;
