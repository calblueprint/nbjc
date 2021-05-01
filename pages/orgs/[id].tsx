import { useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { orgProfile } from 'interfaces/organization';
import { Button, Chip, LinearProgress } from '@material-ui/core';
import { Prisma } from '@prisma/client';
import Layout from 'components/Layout';
import Tab from 'components/Tab';
import computeDate from 'utils/computeDate';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import EventCard from 'components/organization/EventCard';
import styles from '../../styles/Organization.module.css';

type Props = {
  org: Prisma.OrganizationGetPayload<typeof orgProfile>;
  orgUser: {
    id: number;
  };
  errors?: string;
};

const OrgProfile: React.FunctionComponent<Props> = ({
  org,
  orgUser,
  errors,
}) => {
  const router = useRouter();
  const { isEvent } = router.query;
  const [tabState, setTabState] = useState<0 | 1 | 2>(0);
  const eventsList = org?.organizationEvents?.map((event) => {
    return (
      <div className={styles.event}>
        <EventCard event={event} />
      </div>
    );
  });
  const [session, sessionLoading] = useSession();
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

  if (errors) {
    return (
      <Layout title="Error | NBJC">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  if (!sessionLoading)
    return (
      <Layout title={`${org.name} Profile`}>
        <div className={styles.orgMargins}>
          <div className={styles.orgImages}>
            <img
              src="https://1mktxg24rspz19foqjixu9rl-wpengine.netdna-ssl.com/wp-content/uploads/2020/01/eia-berkeley-Cover.png"
              alt="Organization"
            />
          </div>
          {orgUser.id === session?.user.id ? (
            <div className={styles.editButton}>
              <Button
                variant="contained"
                className={styles.editButtonStyles}
                disableElevation
              >
                Edit
              </Button>
            </div>
          ) : null}
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
                  tabName1="About"
                  tabName2="Events"
                  tabState={tabState}
                  setTabState={setTabState}
                />
              </div>
              {tabState === 0 ? (
                <div className={styles.rightContent}>
                  <h3 className={styles.audienceHeader}>
                    Audience Demographics
                  </h3>
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
                // EVENT CARDS START
                <div className={styles.events}>{eventsList}</div>
                // EVENT CARDS END
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default OrgProfile;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string | undefined;

    if (!id) {
      return { notFound: true };
    }

    const org = await prisma.organization.findUnique({
      where: { id: Number(id) },
      select: orgProfile.select,
    });

    if (!org || !org.active) {
      return {
        notFound: true,
      };
    }
    return {
      props: { org, orgUser: org.user },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
