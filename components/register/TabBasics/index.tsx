import { TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import { FormikHandlers, FormikHelpers } from 'formik';
import { Form } from 'interfaces';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from './TabBasics.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
};

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
  values,
  setFieldValue,
}) => {
  const rowSize = 1;
  const placeholderText = ' ';

  return (
    <>
      <div className={styles.row}>
        <p className={styles.descriptor}>Organization Name</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.orgName}
          name="orgName"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Work Type</p>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={workType}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, newValue) => {
            setFieldValue('workType', newValue);
          }}
          className={styles.selectField}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Work Type" />
          )}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Org Type</p>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={orgType}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, newValue) => {
            setFieldValue('orgType', newValue);
          }}
          className={styles.selectField}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Org Type" />
          )}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Name</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.contactName}
          name="contactName"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Contact Email</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.contactEmail}
          name="contactEmail"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Website</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.website}
          name="website"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>Location Type</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.location}
          name="location"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder="location"
        />
      </div>
      <div className={styles.row}>
        <p className={styles.addressDescriptor}>Address</p>
        <div className={styles.addressBlock}>
          <div className={styles.addressRow}>
            <TextField
              className={styles.street}
              onChange={handleChange}
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
              value={values.city}
              name="city"
              variant="outlined"
              multiline
              rows={rowSize}
              placeholder="City"
            />
          </div>
          <div className={styles.addressRow}>
            <TextField
              className={styles.zip}
              onChange={handleChange}
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
              value={values.zipcode}
              name="zipcode"
              variant="outlined"
              multiline
              rows={rowSize}
              placeholder="Zipcode"
            />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>EIN</p>
        <FormControl variant="outlined" className={styles.selectField}>
          <Select value={values.EIN} name="EIN" onChange={handleChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>EIN 1</MenuItem>
            <MenuItem value={20}>EIN 2</MenuItem>
            <MenuItem value={30}>EIN 3</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={styles.row}>
        <p className={styles.descriptor}>founding Date</p>
        <TextField
          className={styles.textField}
          onChange={handleChange}
          value={values.foundingDate}
          name="foundingDate"
          variant="outlined"
          multiline
          rows={rowSize}
          placeholder={placeholderText}
        />
      </div>
      <div className={styles.short}>
        <p>Audience Demographics</p>
        <div className={styles.auto}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={ages}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('ages', newValue);
            }}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Ages" />
            )}
          />
          <Autocomplete
            multiple
            id="tags-outlined"
            options={orientation}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('orientation', newValue);
            }}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Orientation"
              />
            )}
          />
          <Autocomplete
            multiple
            id="tags-outlined"
            options={ethnicity}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setFieldValue('ethnicity', newValue);
            }}
            className={styles.autoField}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Ethnicity"
              />
            )}
          />
        </div>
      </div>
      <div className={styles.short}>
        <p>Mission History</p>
        <TextField
          onChange={handleChange}
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
