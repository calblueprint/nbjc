import {
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import {
  FormikErrors,
  FormikHandlers,
  FormikHelpers,
  FormikTouched,
  FormikValues,
} from 'formik';
import { Form } from 'interfaces/registration';
import {
  AgeDemographicLabels,
  RaceDemographicLabels,
  LgbtqDemographicLabels,
  OrganizationTypeLabels,
  WorkTypeLabels,
} from 'utils/typesLinker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MaskedInput from 'react-text-mask';
import { useImperativeHandle, useState } from 'react';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
import styles from './TabBasics.module.css';

type TabProps = {
  values: Form;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikHelpers<string>['setFieldValue'];
  handleBlur: FormikHandlers['handleBlur'];
  touched: FormikTouched<Form>;
  errors: FormikErrors<Form>;
  readOnly: boolean;
};

const locationType = {
  headquarters: 'Headquarters',
  branch: 'Branch',
};

const TabBasics: React.FC<TabProps> = ({
  handleChange,
  handleBlur,
  touched,
  errors,
  values,
  setFieldValue,
  readOnly,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null): void => {
    setSelectedDate(date);
  };

  // number mask
  interface NumberMaskProps {
    inputRef: (ref: HTMLInputElement | null) => void;
  }
  function NumberMask(props: NumberMaskProps): React.ReactElement {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={(ref: any) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[
          '(',
          /[1-9]/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }
  interface State {
    textmask: string;
  }
  const [numbers, setNumbers] = useState<State>({
    textmask: '(  )    -    ',
  });
  const handleNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNumbers({
      ...numbers,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Organization Name</div>
          <div className={styles.sidenote}>Required</div>
        </div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            id="name"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            value={values.name}
            name="name"
            variant="outlined"
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name ? errors.name : undefined}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Type of Work</div>
        </div>
        <div className={styles.innerRightCol}>
          <FormControl
            className={styles.textField}
            variant="outlined"
            error={Boolean(touched.workType && errors.workType)}
            disabled={readOnly}
          >
            <Select
              id="workType"
              name="workType"
              value={values.workType}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem key="none" value="" disabled>
                <em>None</em>
              </MenuItem>
              {Object.entries(WorkTypeLabels).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.workType ? errors.workType : undefined}
            </FormHelperText>
          </FormControl>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>Type of Organization</div>
        <div className={styles.innerRightCol}>
          <FormControl
            className={styles.textField}
            variant="outlined"
            error={Boolean(touched.organizationType && errors.organizationType)}
            disabled={readOnly}
          >
            <Select
              id="organizationType"
              name="organizationType"
              value={values.organizationType}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem key="none" value="" disabled>
                <em>None</em>
              </MenuItem>
              {Object.entries(OrganizationTypeLabels).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.organizationType ? errors.organizationType : undefined}
            </FormHelperText>
          </FormControl>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Is a 501(c)(3) Organization</div>
          <div className={styles.sidenote}>Required</div>
        </div>
        <div className={styles.innerRightCol}>
          <div className={styles.textField}>
            {/* TODO: change to drop down, yes/no */}
            <Checkbox
              checked={values.is501c3}
              onChange={handleChange}
              name="is501c3"
              color="primary"
              disabled={readOnly}
            />
            <FormHelperText>
              {touched.is501c3 ? errors.is501c3 : undefined}
            </FormHelperText>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Secondary Contact Name</div>
          <div className={styles.sidenote}>
            Required; should be someone in a stable role without much turnover.
          </div>
        </div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            id="contactName"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            value={values.contactName}
            name="contactName"
            variant="outlined"
            error={Boolean(touched.contactName && errors.contactName)}
            helperText={touched.contactName ? errors.contactName : undefined}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Secondary Contact Email</div>
          <div className={styles.sidenote}>Required</div>
        </div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contactEmail}
            name="contactEmail"
            variant="outlined"
            error={Boolean(touched.contactEmail && errors.contactEmail)}
            helperText={touched.contactEmail ? errors.contactEmail : undefined}
            disabled={readOnly}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>Contact Person Phone</div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contactPhone}
            name="contactPhone"
            variant="outlined"
            error={Boolean(touched.contactPhone && errors.contactPhone)}
            helperText={touched.contactPhone ? errors.contactPhone : undefined}
            disabled={readOnly}
            placeholder="(000)000-0000"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>Current Website</div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.website}
            name="website"
            variant="outlined"
            error={Boolean(touched.website && errors.website)}
            helperText={touched.website ? errors.website : undefined}
            disabled={readOnly}
            placeholder="ourwebsite.org"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>
          <div>Address</div>
          <div className={styles.sidenote}>Required</div>
        </div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.address}
            name="address"
            variant="outlined"
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address ? errors.address : undefined}
            disabled={readOnly}
            placeholder="Your Organization's Address"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>EIN</div>
        <div className={styles.innerRightCol}>
          <TextField
            className={styles.textField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.ein}
            name="ein"
            variant="outlined"
            error={Boolean(touched.ein && errors.ein)}
            helperText={touched.ein ? errors.ein : undefined}
            disabled={readOnly}
            placeholder="12345678900"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.innerLeftCol}>Date of Founding</div>
        <div className={styles.innerRightCol}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={styles.textField}
              onBlur={handleBlur}
              value={
                selectedDate === new Date() ? values.foundingDate : selectedDate
              }
              name="foundingDate"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              onChange={handleDateChange}
              inputVariant="outlined"
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
      <div className={styles.short}>
        <div className={styles.innerRow}>
          <p>Audience Demographics</p>
          <p className={styles.sidenote}>Select all that apply</p>
        </div>
        <div className={styles.auto}>
          <div className={styles.autoField}>
            <p>Orientation</p>
            <Autocomplete
              multiple
              id="lgbtqDemographic"
              options={
                Object.keys(LgbtqDemographicLabels) as LgbtqDemographic[]
              }
              getOptionLabel={(option: LgbtqDemographic) =>
                LgbtqDemographicLabels[option]
              }
              filterSelectedOptions
              value={values.lgbtqDemographic}
              onChange={(event, newValue) => {
                setFieldValue('lgbtqDemographic', newValue);
              }}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={Boolean(
                    touched.lgbtqDemographic && errors.lgbtqDemographic
                  )}
                  helperText={
                    touched.lgbtqDemographic
                      ? errors.lgbtqDemographic
                      : undefined
                  }
                />
              )}
              disabled={readOnly}
            />
          </div>
          <div className={styles.autoField}>
            <p>Background</p>
            <Autocomplete
              multiple
              id="raceDemographic"
              options={Object.keys(RaceDemographicLabels) as RaceDemographic[]}
              getOptionLabel={(option: RaceDemographic) =>
                RaceDemographicLabels[option]
              }
              filterSelectedOptions
              value={values.raceDemographic}
              onChange={(event, newValue) => {
                setFieldValue('raceDemographic', newValue);
              }}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={Boolean(
                    touched.raceDemographic && errors.raceDemographic
                  )}
                  helperText={
                    touched.raceDemographic ? errors.raceDemographic : undefined
                  }
                />
              )}
              disabled={readOnly}
            />
          </div>
          <div className={styles.autoField}>
            <p>Age Range</p>
            <Autocomplete
              multiple
              id="ageDemographic"
              options={Object.keys(AgeDemographicLabels) as AgeDemographic[]}
              getOptionLabel={(option: AgeDemographic) =>
                AgeDemographicLabels[option]
              }
              filterSelectedOptions
              onChange={(event, newValue) => {
                setFieldValue('ageDemographic', newValue);
              }}
              value={values.ageDemographic}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={Boolean(
                    touched.ageDemographic && errors.ageDemographic
                  )}
                  helperText={
                    touched.ageDemographic ? errors.ageDemographic : undefined
                  }
                />
              )}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
      <div className={styles.short}>
        <div className={styles.innerRow}>
          <p>Key Photos</p>
          <p className={styles.sidenote}>
            Must be less than [] mb. JPG, JPEG, PNG
          </p>
        </div>
      </div>
      <div className={styles.short}>
        <p>Description and Mission</p>
        <TextField
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.missionStatement}
          name="missionStatement"
          variant="outlined"
          rows={6}
          multiline
          error={Boolean(touched.missionStatement && errors.missionStatement)}
          helperText={
            touched.missionStatement ? errors.missionStatement : undefined
          }
          disabled={readOnly}
        />
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
          error={Boolean(touched.shortHistory && errors.shortHistory)}
          helperText={touched.shortHistory ? errors.shortHistory : undefined}
          disabled={readOnly}
        />
      </div>
    </>
  );
};

export default TabBasics;
