import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useFormik, FieldArray, ArrayHelpers, FormikProps } from 'formik';
import prisma from 'utils/prisma';
import { orgProfile, EditForm } from 'interfaces/organization';
import { Button, Chip, TextField, LinearProgress } from '@material-ui/core';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  Organization,
  Prisma,
} from '@prisma/client';
import Layout from 'components/Layout';
import Project from 'components/organization/Project';
import Tab from 'components/Tab';
import computeDate from 'utils/computeDate';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  AgeDemographicLabels,
  RaceDemographicLabels,
  LgbtqDemographicLabels,
  OrganizationTypeLabels,
  WorkTypeLabels,
} from 'utils/typesLinker';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import styles from '../../styles/Organization.module.css';

type Props = {
  orgProp: Prisma.OrganizationGetPayload<{
    include: { organizationProjects: true };
  }>;
  // org: Prisma.OrganizationGetPayload<typeof orgProfile>;
  orgUser: {
    id: number;
  };
  errors?: string;
  userId?: number;
};

const orientation = [
  'Queer',
  'Asexual/Aromantic',
  'Bisexual',
  'Pansexual',
  'Lesbian/SGL',
  'Gay/SGL',
  'Straight/Heterosexual',
  'LGBTQ+',
  'Other',
];

const ethnicity = [
  'Native',
  'Black',
  'Asian',
  'Hispanic',
  'Arab',
  'White',
  'Other',
];

const ages = ['Children', 'Teens', 'Adults', 'Seniors'];

const OrgProfile: React.FunctionComponent<Props> = ({
  orgProp,
  userId,
  errors,
}) => {
  const router = useRouter();
  const { isEvent } = router.query;
  const [tabState, setTabState] = useState<0 | 1 | 2>(0);
  const [editState, setEditState] = useState<0 | 1>(0); // 0 == read, 1 == edit
  const [errorBanner, setErrorBanner] = useState('');
  const [org, setOrg] = useState(orgProp);
  const [session, sessionLoading] = useSession();

  const cleanVals = (o: EditForm): EditForm => ({
    name: (o && o.name) ?? '',
    contactName: (o && o.contactName) ?? '',
    contactEmail: (o && o.contactEmail) ?? '',
    contactPhone: (o && o.contactPhone) ?? '',
    organizationType: (o && o.organizationType) ?? null,
    workType: (o && o.workType) ?? null,
    address: (o && o.address) ?? '',
    missionStatement: (o && o.missionStatement) ?? '',
    shortHistory: (o && o.shortHistory) ?? '',
    lgbtqDemographic: o ? o.lgbtqDemographic : [],
    raceDemographic: o ? o.raceDemographic : [],
    ageDemographic: o ? o.ageDemographic : [],
    // capacity: (o && o.capacity) ?? null,
    ein: (o && o.ein) ?? '',
    // foundingDate: (o && o.foundingDate) ?? null,
    is501c3: Boolean(o && o.is501c3),
    website: (o && o.website) ?? '',
    // organizationProjects: o ? o.organizationProjects : [],
    organizationProjects:
      (o &&
        o.organizationProjects?.map((proj) => ({
          id: proj.id,
          organizationId: org.id,
          title: proj.title ?? '',
          description: proj.description ?? '',
        }))) ??
      [],
  });

  const handleSubmit = async (values: EditForm): Promise<void> => {
    // left for testing
    console.log('values in handlsubmit UNCLEANED', values);
    console.log('values in handlsubmit CLEANVALS:', cleanVals(values));
    try {
      await fetch(`/api/org/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cleanVals(values) }),
      })
        .then((response) => response.json())
        .then((data) => setOrg(data));
      setEditState(0);
    } catch (ex) {
      setErrorBanner('Did not save.');
    }
  };

  const formik = useFormik({
    initialValues: cleanVals(org),
    onSubmit: handleSubmit,
  });

  const projectsList = formik.values.organizationProjects?.map((project) => {
    return (
      <Project
        key={project.id}
        name={project.title}
        description={project.description ?? ''}
      />
    );
  });

  const projectsListEditable = formik.values.organizationProjects?.map(
    (project) => {
      return (
        <div>
          <TextField
            id={'title'.concat(`${project.id}`)}
            className={styles.projTitle}
            value={project.title}
            name={'title'.concat(`${project.id}`)}
            variant="outlined"
            onChange={formik.handleChange}
          />
          <TextField
            id={'description'.concat(`${project.id}`)}
            className={styles.projDesc}
            value={project.description ?? ''}
            name={'description'.concat(`${project.id}`)}
            variant="outlined"
            multiline
            onChange={formik.handleChange}
          />
        </div>
      );
    }
  );

  const demographics = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographic}>
        {category}
        <div className={styles.demographicTags}>
          {groups?.length !== 0 ? (
            groups?.map((group) => (
              <Chip key={group} label={group} variant="outlined" />
            ))
          ) : (
            <Chip label="None" variant="outlined" />
          )}
        </div>
      </div>
    );
  };

  const demEditOrien = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographicEdit}>
        {category}
        <div className={styles.demographicTags}>
          <Autocomplete
            multiple
            id="lgbtqDemographic"
            options={Object.keys(LgbtqDemographicLabels) as LgbtqDemographic[]}
            getOptionLabel={(option: LgbtqDemographic) =>
              LgbtqDemographicLabels[option]
            }
            filterSelectedOptions
            value={formik.values.lgbtqDemographic}
            onChange={(event, newValue) => {
              formik.setFieldValue('lgbtqDemographic', newValue);
            }}
            onBlur={formik.handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={Boolean(
                  formik.touched.lgbtqDemographic &&
                    formik.errors.lgbtqDemographic
                )}
                helperText={
                  formik.touched.lgbtqDemographic
                    ? formik.errors.lgbtqDemographic
                    : undefined
                }
              />
            )}
          />
        </div>
      </div>
    );
  };

  const demEditBack = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographicEdit}>
        {category}
        <div className={styles.demographicTags}>
          <Autocomplete
            multiple
            id="raceDemographic"
            options={Object.keys(RaceDemographicLabels) as RaceDemographic[]}
            getOptionLabel={(option: RaceDemographic) =>
              RaceDemographicLabels[option]
            }
            filterSelectedOptions
            value={formik.values.raceDemographic}
            onChange={(event, newValue) => {
              formik.setFieldValue('raceDemographic', newValue);
            }}
            // onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={Boolean(
                  formik.touched.raceDemographic &&
                    formik.errors.raceDemographic
                )}
                helperText={
                  formik.touched.raceDemographic
                    ? formik.errors.raceDemographic
                    : undefined
                }
              />
            )}
          />
        </div>
      </div>
    );
  };

  const demEditAge = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographicEdit}>
        {category}
        <div className={styles.demographicTags}>
          <Autocomplete
            multiple
            id="ageDemographic"
            options={Object.keys(AgeDemographicLabels) as AgeDemographic[]}
            getOptionLabel={(option: AgeDemographic) =>
              AgeDemographicLabels[option]
            }
            filterSelectedOptions
            value={formik.values.ageDemographic}
            onChange={(event, newValue) => {
              formik.setFieldValue('ageDemographic', newValue);
            }}
            // onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={Boolean(
                  formik.touched.ageDemographic && formik.errors.ageDemographic
                )}
                helperText={
                  formik.touched.ageDemographic
                    ? formik.errors.ageDemographic
                    : undefined
                }
              />
            )}
          />
        </div>
      </div>
    );
  };

  const editableLeft = (): JSX.Element => {
    return (
      <div>
        {editState === 0 ? (
          // not editable, just viewing
          <div className={styles.rightContent}>
            <h3 className={styles.audienceHeader}>Audience Demographics</h3>
            <div className={styles.demographicSection}>
              {demographics('Orientation', org.lgbtqDemographic)}
              {demographics('Background', org.raceDemographic)}
              {demographics('Age Range', org.ageDemographic)}
            </div>
            <h3 className={styles.audienceHeader}>Our Mission</h3>
            {org.missionStatement && (
              <p className={styles.infoContent}>{org.missionStatement}</p>
            )}
            <h3 className={styles.audienceHeader}>Our History</h3>
            {org.shortHistory && (
              <p className={styles.infoContent}>{org.shortHistory}</p>
            )}
            <div className={styles.projects}>
              <h3 className={styles.audienceHeader}>Our Projects</h3>
              {projectsList}
            </div>
            Projects should be here. If there arent any, then the database
            doesnt have any.
          </div>
        ) : (
          // editable, map contents to TextFields
          <div className={styles.rightContent}>
            <h3 className={styles.audienceHeader}>Audience Demographics</h3>
            <div className={styles.demographicSection}>
              {demEditOrien('Orientation', org.lgbtqDemographic)}
              {demEditBack('Background', org.raceDemographic)}
              {demEditAge('Age Range', org.ageDemographic)}
            </div>
            <h3 className={styles.audienceHeader}>Our Mission</h3>
            <TextField
              className={styles.missionAndProj}
              id="missionStatement"
              value={formik.values.missionStatement}
              name="missionStatement"
              type="text"
              variant="outlined"
              onChange={formik.handleChange}
              multiline
              rows={7}
            />
            <h3>Our History</h3>
            <TextField
              className={styles.missionAndProj}
              id="shortHistory"
              value={formik.values.shortHistory}
              name="shortHistory"
              type="text"
              variant="outlined"
              onChange={formik.handleChange}
              multiline
              rows={7}
            />
            <div className={styles.projects}>
              {projectsListEditable}
              {/* <FieldArray
                name="organizationProjects"
                render={projectsListEditable(formik)}
              />
              ; */}
            </div>
            Projects should be here.
          </div>
        )}
      </div>
    );
  };

  const editableRight = (): JSX.Element => {
    return <div>hey! Events here.</div>;
  };

  const editAndSave = (): JSX.Element => (
    <div className={styles.editButton}>
      {editState === 0 ? (
        // you are viewing, display EDIT button
        <Button
          variant="contained"
          className={styles.editButton}
          disableElevation
          onClick={() => {
            setEditState(1);
          }}
        >
          Edit
        </Button>
      ) : (
        // you are editing, display SAVE button
        <Button
          variant="contained"
          className={styles.editButton}
          disableElevation
          onClick={() => {
            handleSubmit(formik.values);
          }}
        >
          Save
        </Button>
      )}
    </div>
  );

  if (errors) {
    return (
      <Layout title="Error | NBJC">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }
  if (sessionLoading && !org) return <LinearProgress />;
  return (
    <Layout title={`${org && org.name} Profile`}>
      <div className={styles.orgMargins}>
        <div className={styles.orgImages}>
          <img
            src="https://1mktxg24rspz19foqjixu9rl-wpengine.netdna-ssl.com/wp-content/uploads/2020/01/eia-berkeley-Cover.png"
            alt="Organization"
          />
        </div>
        <form onSubmit={formik.handleSubmit}>
          {errorBanner ? (
            <div className={styles.errorBanner}>{errorBanner}</div>
          ) : null}
          {/* Only render edit and save buttons if the user logged in is the owner of the org. */}
          {userId && userId === session?.user.id ? editAndSave() : null}
          <div className={styles.titleColumns}>
            <div className={styles.leftColumn}>
              <h2 className={styles.Header}>{org && org.name}</h2>
              <h3 className={styles.subHeader}>
                {org.workType}
                {org.workType && org.organizationType ? ' • ' : null}
                {org.organizationType}
              </h3>
              {/* Location */}
              <h3 className={styles.infoHeader}>Location</h3>
              <p className={styles.info}>
                <b>Type:</b> Headquarters
              </p>
              {org.address && <p className={styles.info}>{org.address}</p>}
              {/* Basics */}
              {(org.website || org.ein || org.foundingDate) && (
                <h3 className={styles.infoHeader}>Basics</h3>
              )}
              {org.website && (
                <p className={styles.info}>
                  <b>Site:</b> {org.website}
                </p>
              )}
              {org.ein && (
                <p className={styles.info}>
                  <b>EIN:</b> {org.ein}
                </p>
              )}
              {org.foundingDate && (
                <p className={styles.info}>
                  {/* TODO: add hydration to convert dates to date objects beforehand */}
                  <b>Founded:</b> {computeDate(new Date(org.foundingDate), 0)}
                </p>
              )}
              <h3 className={styles.infoHeader}>Members</h3>
              <p className={styles.info}>Frederick Kim, Project Leader</p>
              <p className={styles.info}>Elizabeth Wu, Designer</p>
              <p className={styles.info}>Cindy Zhang, Developer</p>
              <p className={styles.info}>Calvin Chen, Developer</p>
              <p className={styles.info}>Sonja Johanson, Developer</p>
              <p className={styles.info}>Bryanna Gavino, Developer</p>
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.headerButton}>
                <Tab
                  tabName1="About"
                  tabName2="Events"
                  tabState={tabState}
                  setTabState={setTabState}
                />
              </div>
              {tabState === 0 ? (
                <div>{editableLeft()}</div>
              ) : (
                <div>{editableRight()}</div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default OrgProfile;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string | undefined;

    if (!id) {
      return { notFound: true };
    }
    const orgProp = await prisma.organization.findUnique({
      where: { id: Number(id) },
      select: orgProfile.select,
    });

    if (!orgProp || !orgProp.active) {
      return {
        notFound: true,
      };
    }
    return {
      props: { orgProp, userId: orgProp.user?.id },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
