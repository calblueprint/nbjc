import {
  AgeDemographic,
  LgbtqDemographic,
  RaceDemographic,
} from '@prisma/client';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonProps,
} from '@material-ui/core';
import styles from './Filters.module.css';

type FiltersProps = {
  demographicFilters: LgbtqDemographic[];
  backgroundFilters: RaceDemographic[];
  audienceFilters: AgeDemographic[];
  handleDemographicChange: (
    event: React.ChangeEvent<{ value: unknown }>
  ) => void;
  handleBackgroundChange: (
    event: React.ChangeEvent<{ value: unknown }>
  ) => void;
  handleAudienceChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  handleSearch: () => void;
};

const Filters: React.FunctionComponent<FiltersProps> = ({
  demographicFilters,
  backgroundFilters,
  audienceFilters,
  handleDemographicChange,
  handleBackgroundChange,
  handleAudienceChange,
  handleSearch,
}) => {
  const outlinedButton = (props: ButtonProps): JSX.Element => (
    <Button variant="outlined" disableRipple {...props} />
  );
  return (
    <>
      <FormControl
        focused={Boolean(demographicFilters.length)}
        className={styles.filter}
        variant="outlined"
      >
        <InputLabel shrink={false} classes={{ root: styles.filterLabel }}>
          {!demographicFilters.length && 'Identities'}
        </InputLabel>
        <Select
          native={false}
          className={
            demographicFilters.length > 0
              ? styles.filterDropDownActive
              : styles.filterDropDown
          }
          multiple
          value={demographicFilters}
          onChange={handleDemographicChange}
          renderValue={() => (
            <InputLabel classes={{ root: styles.selectedLabel }}>
              Identities
            </InputLabel>
          )}
          MenuProps={{
            variant: 'menu',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          {(Object.keys(LgbtqDemographicLabels) as LgbtqDemographic[]).map(
            (filterOption: LgbtqDemographic) => (
              <MenuItem
                classes={{
                  selected: styles.selectedFilter,
                  root: styles.filterOption,
                }}
                style={{
                  backgroundColor: demographicFilters.includes(
                    LgbtqDemographicLabels[filterOption] as LgbtqDemographic
                  )
                    ? '#F8F4FF'
                    : 'transparent',
                }}
                component={outlinedButton}
                disableRipple
                value={filterOption}
              >
                {LgbtqDemographicLabels[filterOption]}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <FormControl
        focused={Boolean(backgroundFilters.length)}
        className={styles.filter}
        variant="outlined"
      >
        <InputLabel shrink={false} className={styles.filterLabel}>
          {!backgroundFilters.length && 'Background'}
        </InputLabel>
        <Select
          className={
            backgroundFilters.length > 0
              ? styles.filterDropDownActive
              : styles.filterDropDown
          }
          multiple
          value={backgroundFilters}
          onChange={handleBackgroundChange}
          renderValue={() => (
            <InputLabel classes={{ root: styles.selectedLabel }}>
              Background
            </InputLabel>
          )}
          MenuProps={{
            variant: 'menu',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          {(Object.keys(RaceDemographicLabels) as RaceDemographic[]).map(
            (filterOption: RaceDemographic) => (
              <MenuItem
                classes={{
                  selected: styles.selectedFilter,
                  root: styles.filterOption,
                }}
                component={outlinedButton}
                className={styles.filterOption}
                style={{
                  backgroundColor: backgroundFilters.includes(
                    RaceDemographicLabels[filterOption] as RaceDemographic
                  )
                    ? '#F8F4FF'
                    : 'transparent',
                }}
                disableRipple
                value={filterOption}
              >
                {RaceDemographicLabels[filterOption]}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <FormControl
        focused={Boolean(audienceFilters.length)}
        className={styles.filter}
        variant="outlined"
      >
        <InputLabel shrink={false} className={styles.filterLabel}>
          {!audienceFilters.length && 'Audience'}
        </InputLabel>
        <Select
          className={
            audienceFilters.length > 0
              ? styles.filterDropDownActive
              : styles.filterDropDown
          }
          multiple
          value={audienceFilters}
          onChange={handleAudienceChange}
          renderValue={() => (
            <InputLabel classes={{ root: styles.selectedLabel }}>
              Audience
            </InputLabel>
          )}
          MenuProps={{
            variant: 'menu',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          {(Object.keys(AgeDemographicLabels) as AgeDemographic[]).map(
            (filterOption: AgeDemographic) => (
              <MenuItem
                classes={{
                  selected: styles.selectedFilter,
                  root: styles.filterOption,
                }}
                component={outlinedButton}
                disableRipple
                style={{
                  backgroundColor: audienceFilters.includes(
                    AgeDemographicLabels[filterOption] as AgeDemographic
                  )
                    ? '#F8F4FF'
                    : 'transparent',
                }}
                value={filterOption}
              >
                {AgeDemographicLabels[filterOption]}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={styles.applyButton}
        onClick={handleSearch}
        disableElevation
      >
        Apply
      </Button>
    </>
  );
};

export default Filters;
