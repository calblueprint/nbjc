import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Button, ButtonGroup, Chip } from '@material-ui/core';
import { Organization } from '@prisma/client';
import Layout from 'components/Layout';
import KeyWord from 'components/organization/KeyWord/index';
import Project from 'components/organization/Project/index';
import computeDate from 'utils/computeDate';
import { getOrganization } from '../api/orgs/[id]';
import styles from '../../styles/Organization.module.css';

type Props = {
  org: Organization;
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
  const [showInfo, setshowInfo] = useState<boolean>(true);

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
              {org.workType && org.organizationType ? ' ● ' : null}
              {org.organizationType}
            </h3>
            <h3 className={styles.infoHeader}>Location</h3>
            <p className={styles.info}>
              <b>Type:</b> Headquarters
            </p>
            {org.address && <p className={styles.info}>{org.address}</p>}
            <h3 className={styles.infoHeader}>Basics</h3>
            <p className={styles.info}>
              <b>Site:</b> currentwebsite.org
            </p>
            {org.ein && (
              <p className={styles.info}>
                <b>EIN:</b> {org.ein}
              </p>
            )}
            {org.foundingDate && (
              <p className={styles.info}>
                <b>Founded:</b> {computeDate(new Date(org.foundingDate), 0)}
              </p>
            )}
            <h3 className={styles.infoHeader}>Members</h3>
            <p className={styles.info}>Fred Kim, CEO of redprint</p>
            <p className={styles.info}>Cindy Zhang, CEO of redprint</p>
            <p className={styles.info}>Calvin Chen, CEO of redprint</p>
            <p className={styles.info}>Sonja Johanson, CEO of redprint</p>
            <p className={styles.info}>Elizabeth Wu, CEO of redprint</p>
            <p className={styles.info}>Bryanna Gavino, CEO of redprint</p>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.headerButton}>
              <ButtonGroup
                variant="contained"
                color="primary"
                className={styles.buttonGroup}
              >
                <Button
                  className={
                    showInfo ? styles.buttonIndSelected : styles.buttonInd
                  }
                  onClick={() => setshowInfo(true)}
                  disableElevation
                >
                  Information
                </Button>
                <Button
                  className={
                    showInfo ? styles.buttonInd : styles.buttonIndSelected
                  }
                  onClick={() => setshowInfo(false)}
                  disableElevation
                >
                  Project and Events
                </Button>
              </ButtonGroup>
            </div>
            {showInfo ? (
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

    const resp = await getOrganization(id);
    const org = JSON.parse(JSON.stringify(resp)) as Organization;
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
