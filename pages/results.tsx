import { GetServerSideProps } from 'next';
<<<<<<< HEAD
import {
  PrismaClient,
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
=======
>>>>>>> feat: front end filters
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
<<<<<<< HEAD
} from '@material-ui/core';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';

import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Results.module.css';
=======
  Chip,
  Button
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Home.module.css';
>>>>>>> feat: front end filters

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

<<<<<<< HEAD
type ResultsProps = {
  orgs: PublicOrganization[];
};

// const prisma = new PrismaClient();

const Results: React.FC<ResultsProps> = ({ orgs }) => {
=======
type HomeProps = {
  orgs: PublicOrganization[];
};

// using lists for now, but maybe replace with enums?
const demographicTypes = [
  'LGBTQ+',
  'SGL',
  'Transgender',
  'Asexual/Aromantic',
  'Other',
];

const backgroundTypes = ['Grassroots/Local', 'Statewide', 'National', 'Other'];

const audienceTypes = [
  'POC (All)',
  'Black',
  'Asian',
  'Pacific Islander',
  'Latinx',
  'Native/Indigeneous',
  'Other',
];

const Home: React.FC<HomeProps> = ({ orgs }) => {
>>>>>>> feat: front end filters
  const router = useRouter();

  // This is to verify whether or not the current user has a proper session configured to see the page.
  // Will be implemented in the next PR.
  // const [session, loading] = useSession();

<<<<<<< HEAD
=======
  const [demographicFilters, setDemographicFilters] = React.useState<string[]>(
    []
  );
  const [backgroundFilters, setBackgroundFilters] = React.useState<string[]>(
    []
  );
  const [audienceFilters, setAudienceFilters] = React.useState<string[]>([]);

  const handleDemographicChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setDemographicFilters(event.target.value as string[]);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBackgroundFilters(event.target.value as string[]);
    console.log(event.target.value as string[]);
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as string[]);
  };

  const outlinedButton = (props) => <Button variant="outlined" disableRipple {...props}/>

>>>>>>> feat: front end filters
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
<<<<<<< HEAD
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel>Keyword</InputLabel>
                <Select label="Keyword">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel>Keyword</InputLabel>
                <Select label="Keyword">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel>More</InputLabel>
                <Select label="More">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
=======
              <FormControl focused={Boolean(demographicFilters.length)} className={styles.filter} variant="outlined">
                <InputLabel shrink={false} classes={{ root: styles.filterLabel}}>
                  {!Boolean(demographicFilters.length) && "Identities"}
                </InputLabel>
                <Select
                  native={false}
                  className={styles.filterDropDown}
                  multiple
                  value={demographicFilters}
                  onChange={handleDemographicChange}
                  renderValue={(value) => (
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
                  {demographicTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      style={{ backgroundColor: demographicFilters.includes(filterOption) ? '#F8F4FF' :  'transparent'}}
                      component={outlinedButton}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl focused={Boolean(backgroundFilters.length)} className={styles.filter} variant="outlined">
                <InputLabel shrink={false} className={styles.filterLabel}>
                  {!Boolean(backgroundFilters.length) && "Background"}
                </InputLabel>
                <Select
                  className={styles.filterDropDown}
                  multiple
                  value={backgroundFilters}
                  onChange={handleBackgroundChange}
                  renderValue={(value) => (
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
                  {backgroundTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      component={outlinedButton}
                      className={styles.filterOption}
                      style={{ backgroundColor: backgroundFilters.includes(filterOption) ? '#F8F4FF' :  'transparent'}}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl focused={Boolean(audienceFilters.length)} className={styles.filter} variant="outlined">
                <InputLabel shrink={false} className={styles.filterLabel}>
                {!Boolean(audienceFilters.length) && "Audience"}
                </InputLabel>
                <Select
                  className={styles.filterDropDown}
                  multiple
                  value={audienceFilters}
                  onChange={handleAudienceChange}
                  renderValue={(value) => (
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
                  {audienceTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      component={outlinedButton}
                      disableRipple
                      style={{ backgroundColor: audienceFilters.includes(filterOption) ? '#F8F4FF' :  'transparent'}}
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
>>>>>>> feat: front end filters
                </Select>
              </FormControl>
            </div>

            <div className={styles.cards}>
<<<<<<< HEAD
              {orgs && orgs.length !== 0 ? (
=======
              {orgs.length !== 0 ? (
>>>>>>> feat: front end filters
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

<<<<<<< HEAD
export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Only add filters if they are listed, otherwise use all filters
    const orientationBody = context.query.orientation
      ? context.query.orientation
      : Object.keys(LgbtqDemographicLabels);
    const ethnicityBody = context.query.ethnicity
      ? context.query.ethnicity
      : Object.keys(RaceDemographicLabels);
    const agesBody = context.query.ages
      ? context.query.ages
      : Object.keys(AgeDemographicLabels);
    const orgs = await prisma.organization.findMany({
      where: {
        name: {
          contains: context.query?.orgName as string,
          mode: 'insensitive',
        },
        lgbtqDemographic: {
          hasSome: orientationBody as LgbtqDemographic[],
        },
        raceDemographic: {
          hasSome: ethnicityBody as RaceDemographic[],
        },
        ageDemographic: {
          hasSome: agesBody as AgeDemographic[],
        },
      },
    });
    const propOrgs = JSON.parse(JSON.stringify(orgs)) as PublicOrganization[];
    return {
      props: {
        orgs: propOrgs,
      },
    };
  } catch (err) {
    // Probably do a better error state, toast? Not just redirect and not indicate anything.
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
=======
export default Home;

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
>>>>>>> feat: front end filters
  }
};
