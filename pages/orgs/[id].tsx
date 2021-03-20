import { useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import { Button, Chip } from '@material-ui/core';
import Layout from 'components/Layout';
import Project from 'components/organization/Project';
import Tab from 'components/Tab';
import computeDate from 'utils/computeDate';
import styles from '../../styles/Organization.module.css';

type Props = {
  org: Pick<
    Organization,
    | 'id'
    | 'name'
    | 'organizationType'
    | 'workType'
    | 'address'
    | 'missionStatement'
    | 'shortHistory'
    | 'lgbtqDemographic'
    | 'raceDemographic'
    | 'ageDemographic'
    | 'capacity'
    | 'ein'
    | 'foundingDate'
    | 'is501c3'
    | 'website'
  >;
  errors?: string;
};

const projects = [
  {
    name: 'Project 1 Name',
    description:
      'Long description about this project or initiative. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut porttitor leo a diam sollicitudin tempor id. Sem nulla pharetra diam sit amet nisl. Neque aliquam vestibulum morbi blandit cursus risus at. Luctus accumsan tortor posuere ac ut consequat. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Vitae congue mauris rhoncus aenean vel elit scelerisque. Ullamcorper velit sed ullamcorper morbi. Quam viverra orci sagittis eu volutpat odio. Elementum nisi quis eleifend quam. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Justo laoreet sit amet cursus sit amet. ',
  },
  {
    name: 'Project 2 Name',
    description:
      'Long description about this project or initiative. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut porttitor leo a diam sollicitudin tempor id. Sem nulla pharetra diam sit amet nisl. Neque aliquam vestibulum morbi blandit cursus risus at. Luctus accumsan tortor posuere ac ut consequat. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Vitae congue mauris rhoncus aenean vel elit scelerisque. Ullamcorper velit sed ullamcorper morbi. Quam viverra orci sagittis eu volutpat odio. Elementum nisi quis eleifend quam. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Justo laoreet sit amet cursus sit amet. ',
  },
  {
    name: 'Annual Event 1 Name',
    description:
      'Long description about this project or initiative. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut porttitor leo a diam sollicitudin tempor id. Sem nulla pharetra diam sit amet nisl. Neque aliquam vestibulum morbi blandit cursus risus at. Luctus accumsan tortor posuere ac ut consequat. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Vitae congue mauris rhoncus aenean vel elit scelerisque. Ullamcorper velit sed ullamcorper morbi. Quam viverra orci sagittis eu volutpat odio. Elementum nisi quis eleifend quam. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Justo laoreet sit amet cursus sit amet. ',
  },
];
const projectsList = projects.map((project) => {
  return <Project name={project.name} description={project.description} />;
});

const OrgProfile: React.FunctionComponent<Props> = ({ org, errors }) => {
  const [tabState, setTabState] = useState<0 | 1 | 2>(0);

  const demographics = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographic}>
        {category}
        <div className={styles.demographicTags}>
          {groups.length !== 0 ? (
            groups.map((group) => <Chip label={group} variant="outlined" />)
          ) : (
            <Chip label="None" variant="outlined" />
          )}
        </div>
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
        <div className={styles.editButton}>
          <Button
            variant="contained"
            className={styles.editButtonStyles}
            disableElevation
          >
            Edit
          </Button>
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
              <div className={styles.rightContent}>
                <h3 className={styles.audienceHeader}>Audience Demographics</h3>
                <div className={styles.demographicSection}>
                  {demographics('Identities', org.lgbtqDemographic)}
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
              <div className={styles.projects}>{projectsList}</div>
            )}
          </div>
        </div>
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

    const resp = await await prisma.organization.findOne({
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
