import { GetServerSideProps } from 'next';
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
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

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
  const router = useRouter();

  // This is to verify whether or not the current user has a proper session configured to see the page.
  // Will be implemented in the next PR.
  // const [session, loading] = useSession();

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
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as string[]);
  };

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
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel classes={{ root: styles.filterLabel }}>
                  Identities
                </InputLabel>
                <Select
                  native={false}
                  className={styles.filterDropDown}
                  label="Identities"
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
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel className={styles.filterLabel}>
                  Background
                </InputLabel>
                <Select
                  className={styles.filterDropDown}
                  label="Background"
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
                      className={styles.filterOption}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel className={styles.filterLabel}>Audience</InputLabel>
                <Select
                  className={styles.filterDropDown}
                  label="Audience"
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
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className={styles.cards}>
              {orgs.length !== 0 ? (
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
  }
};
