import { GetServerSideProps } from 'next';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';
import prisma from 'utils/prisma';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { PublicOrganization } from 'interfaces/organization';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Button,
  ButtonProps,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import { useState } from 'react';
import styles from '../styles/Results.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

type ResultsProps = {
  orgs: PublicOrganization[];
};

// const prisma = new PrismaClient();

const Results: React.FC<ResultsProps> = ({ orgs }) => {
  const router = useRouter();

  // TO-DO optimize theme/color changes with Select, MenuItem, & Button components
  const demographicTypes = Object.keys(
    LgbtqDemographicLabels
  ) as LgbtqDemographic[];
  const backgroundTypes = Object.keys(
    RaceDemographicLabels
  ) as RaceDemographic[];
  const audienceTypes = Object.keys(AgeDemographicLabels) as AgeDemographic[];

  // This is to verify whether or not the current user has a proper session configured to see the page.
  // Will be implemented in the next PR.
  // const [session, loading] = useSession();

  const [demographicFilters, setDemographicFilters] = useState<string[]>([]);
  const [backgroundFilters, setBackgroundFilters] = useState<string[]>([]);

  const [audienceFilters, setAudienceFilters] = useState<string[]>([]);

  const handleDemographicChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setDemographicFilters(event.target.value as string[]);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBackgroundFilters(event.target.value as string[]);
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as string[]);
  };

  // TO-DO fix return type here
  const outlinedButton = (props: ButtonProps): any => (
    <Button variant="outlined" disableRipple {...props} />
  );

  return (
    <Layout>
      <div className={styles.pageFlex}>
        <TextField
          id="outlined-size-small"
          placeholder="Explore Organizations"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <div className={styles.pageContent}>
          <div className={styles.leftCol}>
            <div className={styles.filters}>
              <FormControl
                focused={Boolean(demographicFilters.length)}
                className={styles.filter}
                variant="outlined"
              >
                <InputLabel
                  shrink={false}
                  classes={{ root: styles.filterLabel }}
                >
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
                  {demographicTypes.map((filterOption: LgbtqDemographic) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      style={{
                        backgroundColor: demographicFilters.includes(
                          LgbtqDemographicLabels[filterOption]
                        )
                          ? '#F8F4FF'
                          : 'transparent',
                      }}
                      component={outlinedButton}
                      disableRipple
                      value={LgbtqDemographicLabels[filterOption]}
                    >
                      {LgbtqDemographicLabels[filterOption]}
                    </MenuItem>
                  ))}
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
                  {backgroundTypes.map((filterOption: RaceDemographic) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      component={outlinedButton}
                      className={styles.filterOption}
                      style={{
                        backgroundColor: backgroundFilters.includes(
                          RaceDemographicLabels[filterOption]
                        )
                          ? '#F8F4FF'
                          : 'transparent',
                      }}
                      disableRipple
                      value={RaceDemographicLabels[filterOption]}
                    >
                      {RaceDemographicLabels[filterOption]}
                    </MenuItem>
                  ))}
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
                  {audienceTypes.map((filterOption: AgeDemographic) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      component={outlinedButton}
                      disableRipple
                      style={{
                        backgroundColor: audienceFilters.includes(
                          AgeDemographicLabels[filterOption]
                        )
                          ? '#F8F4FF'
                          : 'transparent',
                      }}
                      value={AgeDemographicLabels[filterOption]}
                    >
                      {AgeDemographicLabels[filterOption]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className={styles.cards}>
              {orgs && orgs.length !== 0 ? (
                orgs.map((org) => (
                  <Card className={styles.card} key={org.id}>
                    <CardActionArea
                      onClick={() => router.push(`/orgs/${org.id}`)}
                    >
                      <CardContent>
                        <Typography variant="h5">{org.name}</Typography>
                        <Typography variant="body2">
                          {org.organizationType}
                          {org.organizationType && org.workType ? ' • ' : null}
                          {org.workType}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))
              ) : (
                <Typography>No Organizations</Typography>
              )}
            </div>
          </div>

          <div className={styles.rightCol}>
            <Map orgs={orgs} width="100%" height="100%" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resp = await prisma.organization.findMany({
      where: { active: true },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        organizationType: true,
        workType: true,
        lat: true,
        long: true,
      },
    });
    const orgs = JSON.parse(JSON.stringify(resp)) as PublicOrganization[];
    return {
      props: {
        orgs,
      },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
