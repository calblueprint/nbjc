import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useFormik, FormikHandlers, FormikHelpers, FormikErrors } from 'formik';
import prisma from 'utils/prisma';
import { Organization, PrismaClient, Prisma } from '@prisma/client';
import { Button, Chip, TextField } from '@material-ui/core';
import Layout from 'components/Layout';
import { AppQnR, Form } from 'interfaces/registration';
import { EditForm } from 'interfaces/organization';
import Project from 'components/organization/Project';
import Tab from 'components/Tab';
import computeDate from 'utils/computeDate';
import styles from '../../styles/Organization.module.css';

type Props = {
  org: Prisma.OrganizationGetPayload<{
    include: { organizationProjects: true };
  }>;
  errors?: string;
};

// type formProps = {
//   Form: {
//     name: (org && org.name) ?? '',
//     contactName: (org && org.contactName) ?? '',
//     contactEmail: (org && org.contactEmail) ?? '',
//     contactPhone: (org && org.contactPhone) ?? '',
//   };
// };

const OrgProfile: React.FunctionComponent<Props> = ({ org, errors }) => {
  const [tabState, setTabState] = useState<0 | 1 | 2>(0);
  const [editState, setEditState] = useState<0 | 1>(0); // 0 == read, 1 == edit
  // const [selectedOrg, setSelectedOrg] = useState<PublicOrganization | null>(null);
  const [errorBanner, setErrorBanner] = useState('');

  const projectsList = org?.organizationProjects?.map((project) => {
    return (
      <Project name={project.title} description={project.description ?? ''} />
    );
  });

  const projectsListEditable = org?.organizationProjects?.map((project) => {
    return (
      // <Project name={project.title} description={project.description ?? ''} />
      <div>
        <TextField
          className={styles.projTitle}
          value={project.title}
          name="projTitle"
          variant="outlined"
        />
        <TextField
          className={styles.projDesc}
          value={project.description ?? ''}
          name="projDescription"
          variant="outlined"
          multiline
        />
      </div>
    );
  });

  // FIXME: body of request
  const handleSubmit = async (
    values: EditForm
    // actions: FormikHelpers<Props>
  ): Promise<void> => {
    try {
      await fetch(`/api/app/orgs/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      setEditState(0);
    } catch (ex) {
      setErrorBanner('Did not save.');
    }
    // router.replace(router.asPath);
  };

  const initVals: EditForm = {
    name: (org && org.name) ?? '',
    contactName: (org && org.contactName) ?? '',
    contactEmail: (org && org.contactEmail) ?? '',
    contactPhone: (org && org.contactPhone) ?? '',
    organizationType: (org && org.organizationType) ?? null,
    workType: (org && org.workType) ?? null,
    address: (org && org.address) ?? '',
    missionStatement: (org && org.missionStatement) ?? '',
    shortHistory: (org && org.shortHistory) ?? '',
    lgbtqDemographic: org ? org.lgbtqDemographic : [],
    raceDemographic: org ? org.raceDemographic : [],
    ageDemographic: org ? org.ageDemographic : [],
    capacity: (org && org.capacity) ?? null,
    ein: (org && org.ein) ?? '',
    foundingDate: (org && org.foundingDate) ?? null,
    is501c3: Boolean(org && org.is501c3),
    website: (org && org.website) ?? '',
    organizationProjects: org ? org.organizationProjects : [],
  };

  const formik = useFormik({
    initialValues: initVals,
    // validate: handleValidate(false),
    // validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const demographics = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographic}>
        {category}
        <div className={styles.demographicTags}>
          {groups.length !== 0 ? (
            groups.map((group) => (
              <Chip key={group} label={group} variant="outlined" />
            ))
          ) : (
            <Chip label="None" variant="outlined" />
          )}
        </div>
      </div>
    );
  };

  const editableLeft = (): JSX.Element => {
    return (
      <div>
        {editState === 0 ? (
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
          </div>
        ) : (
          // editable, map contents to TextFields
          <div className={styles.rightContent}>
            <h3 className={styles.audienceHeader}>Audience Demographics</h3>
            <div className={styles.demographicSection}>
              {demographics('Orientation', org.lgbtqDemographic)}
              {demographics('Background', org.raceDemographic)}
              {demographics('Age Range', org.ageDemographic)}
            </div>
            <h3 className={styles.audienceHeader}>Our Mission</h3>
            <TextField
              // className={styles.projDesc}
              value={
                org.missionStatement && (
                  <p className={styles.infoContent}>{org.missionStatement}</p>
                )
              }
              name="shortHistory"
              variant="outlined"
              onChange={formik.handleChange}
              multiline
            />
            <h3 className={styles.audienceHeader}>Our History</h3>
            <TextField
              // className={styles.projDesc}
              value={
                org.shortHistory && (
                  <p className={styles.infoContent}>{org.shortHistory}</p>
                )
              }
              name="shortHistory"
              variant="outlined"
              multiline
            />
          </div>
        )}
      </div>
    );
  };

  const editableRight = (): JSX.Element => {
    return (
      <div>
        {editState === 0 ? (
          <div className={styles.projects}>{projectsList}</div>
        ) : (
          // editable
          <div className={styles.projects}>{projectsListEditable}</div>
        )}
      </div>
    );
  };

  if (errors) {
    return (
      <Layout title="Error | NBJC">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout title={`${org.name} Profile`}>
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
                className={styles.saveButton}
                disableElevation
                onClick={() => {
                  handleSubmit(org);
                }}
              >
                Save
              </Button>
            )}
          </div>
          <div className={styles.titleColumns}>
            <div className={styles.leftColumn}>
              <h2 className={styles.Header}>{org.name}</h2>
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
              {/* Members */}
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
                  tabName1="information"
                  tabName2="project and events"
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

    const resp = await await prisma.organization.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        organizationType: true,
        workType: true,
        address: true,
        missionStatement: true,
        shortHistory: true,
        lgbtqDemographic: true,
        raceDemographic: true,
        ageDemographic: true,
        capacity: true,
        ein: true,
        foundingDate: true,
        is501c3: true,
        website: true,
        organizationProjects: true,
        organizationEvents: true,
      },
    });
    const org = JSON.parse(JSON.stringify(resp));
    if (!org) {
      return {
        notFound: true,
      };
    }
    return {
      props: { org },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
