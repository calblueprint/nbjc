import { useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  useFormik,
  FieldArray,
  ArrayHelpers,
  FormikProps,
  FormikHelpers,
} from 'formik';
import prisma from 'utils/prisma';
import { orgProfile, EditForm } from 'interfaces/organization';
import {
  Button,
  Chip,
  TextField,
  LinearProgress,
  Typography,
  Link,
} from '@material-ui/core';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  Organization,
  Prisma,
} from '@prisma/client';
import Layout from 'components/Layout';
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
import Toast from 'components/Toast';
import EventCard from 'components/organization/EventCard';
import Project from 'components/organization/Project';
import styles from '../../styles/Organization.module.css';

type Props = {
  orgProp: Prisma.OrganizationGetPayload<{
    include: { organizationProjects: true; organizationEvents: true };
  }>;
  // org: Prisma.OrganizationGetPayload<typeof orgProfile>;
  orgUser: {
    id: number;
  };
  errors?: string;
  userId?: number;
};

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
  const eventsList = org?.organizationEvents?.map((event) => {
    return (
      <div className={styles.event}>
        <EventCard event={event} />
      </div>
    );
  });
  const [session, sessionLoading] = useSession();

  const cleanVals = (o: EditForm): EditForm => ({
    name: (o && o.name) ?? '',
    contactName: (o && o.contactName) ?? '',
    contactEmail: (o && o.contactEmail) ?? '',
    contactPhone: (o && o.contactPhone) ?? '',
    organizationType: (o && o.organizationType) ?? '',
    workType: (o && o.workType) ?? '',
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
          id: proj.id ?? undefined,
          organizationId: org.id ?? undefined,
          title: proj.title ?? '',
          description: proj.description ?? '',
        }))) ??
      [],
  });

  const handleSubmit = async (values: EditForm): Promise<void> => {
    try {
      await fetch(`/api/org/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cleanVals(values) }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setErrorBanner('.');
          } else {
            setOrg(data);
          }
          setEditState(0);
        });
    } catch (ex) {
      setErrorBanner('Did not save.');
    }
  };

  const formik = useFormik({
    // This conversion of org -> EditForm is not completely right.
    // Org type has more attributes than EditForm does, which is because org's attributes (capacity, foundingDate) are used in this file beyond EditForm.
    initialValues: cleanVals(org as EditForm),
    onSubmit: handleSubmit,
  });

  const addNewProj = (
    values: EditForm,
    setFieldValue: FormikHelpers<string>['setFieldValue']
  ): void => {
    const currProjs = values.organizationProjects;
    currProjs.push({ title: '', description: '' });
    setFieldValue('organizationProjects', currProjs);
  };

  const deleteProj = (
    values: EditForm,
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    index: number
  ): void => {
    const currProjs = values.organizationProjects;
    currProjs.splice(index, 1);
    setFieldValue('organizationProjects', currProjs);
  };

  const projectsList = formik.values.organizationProjects?.map(
    (project, index) => {
      return (
        <Project
          key={project.id}
          name={project.title}
          description={project.description ?? ''}
        />
      );
    }
  );

  const projectsListEditable = formik.values.organizationProjects?.map(
    (project, index) => {
      return (
        <div className={styles.addEvent}>
          <div className={styles.projheader}>
            <Typography className={styles.projres}>
              Project or Resource Name
            </Typography>
            <Link>
              <Button
                className={styles.deleteButton}
                color="secondary"
                onClick={() =>
                  deleteProj(formik.values, formik.setFieldValue, index)
                }
              >
                Delete
              </Button>
            </Link>
          </div>

          <TextField
            className={styles.projTitle}
            value={project.title}
            name={`organizationProjects.${index}.title`}
            variant="outlined"
            onChange={formik.handleChange}
          />
          <Typography className={styles.projdesctitle}>
            Description or Links
          </Typography>
          <TextField
            className={styles.projDesc}
            value={project.description ?? ''}
            name={`organizationProjects.${index}.description`}
            variant="outlined"
            multiline
            rows={6}
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
            groups?.map((group) => {
              let label;
              if (category === 'Orientation')
                label = LgbtqDemographicLabels[group as LgbtqDemographic];
              else if (category === 'Background')
                label = RaceDemographicLabels[group as RaceDemographic];
              else if (category === 'Age Range')
                label = AgeDemographicLabels[group as AgeDemographic];
              return <Chip key={group} label={label} variant="outlined" />;
            })
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
              {org.organizationProjects ? (
                <h3 className={styles.audienceHeader}>
                  Our Projects and Resources
                </h3>
              ) : null}
              {projectsList}
            </div>
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
            <h3 className={styles.audienceHeader}>Our History</h3>
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
            <div className={styles.alignProjects}>
              <Button
                onClick={() => addNewProj(formik.values, formik.setFieldValue)}
                variant="outlined"
                className={styles.addNewProj}
              >
                Add New Project
              </Button>
              <div className={styles.projects}>
                {projectsListEditable}
                {/* <FieldArray
                name="organizationProjects"
                render={projectsListEditable(formik)}
              />
              ; */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
            <Toast type="error" clickAwayListener={() => setErrorBanner('')}>
              {errorBanner}
            </Toast>
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
                // EVENT CARDS START
                <div className={styles.events}>{eventsList}</div>
                // EVENT CARDS END
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
