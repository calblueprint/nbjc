import { useState } from 'react';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Organization } from '@prisma/client';
import { sampleOrgData } from 'utils/sample-data';
import Layout from 'components/Layout';
import styles from '../../styles/Organization.module.css';
import KeyWord from '../../components/organization/KeyWord/index';
import Project from '../../components/organization/Project/index';
import { getOrganization } from '../api/orgs/[id]';

type Props = {
  item?: Organization;
  errors?: string;
};

const orientation = ['LGBTQ+', 'SGL'];
const orientationList = orientation.map((keyWord) => {
  return <KeyWord word={keyWord} />;
});

const background = ['POC', 'Black', 'Latix'];
const backgroundList = background.map((keyWord) => {
  return <KeyWord word={keyWord} />;
});

const age = ['All Ages'];
const ageList = age.map((keyWord) => {
  return <KeyWord word={keyWord} />;
});

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

const StaticPropsDetail: React.FunctionComponent<Props> = ({
  item,
  errors,
}) => {
  const [showInfo, setshowInfo] = useState<boolean>(true);
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${
        item ? item.name : 'Organization Detail'
      } | Next.js + TypeScript Example`}
    >
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
            <h2 className={styles.Header}>{item.name}</h2>
            <h3 className={styles.subHeader}>Type of Work ● Type of Org</h3>
            <h3 className={styles.infoHeader}>Location</h3>
            <p className={styles.info}>
              <b>Type:</b> Headquarters
            </p>
            <p className={styles.info}>123 Street Name</p>
            <p className={styles.info}>City, State 123456</p>
            <h3 className={styles.infoHeader}>Basics</h3>
            <p className={styles.info}>
              <b>Site:</b> currentwebsite.org
            </p>
            <p className={styles.info}>
              <b>EIN:</b> 12341234123412
            </p>
            <p className={styles.info}>
              <b>Founded:</b> MM/DD/YYYY
            </p>
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
                  <div className={styles.demographic}>
                    Orientation
                    <div className={styles.demographicTags}>
                      {orientationList}
                    </div>
                  </div>
                  <div className={styles.demographic}>
                    Background
                    <div className={styles.demographicTags}>
                      {backgroundList}
                    </div>
                  </div>
                  <div className={styles.demographic}>
                    Age Range
                    <div className={styles.demographicTags}>{ageList}</div>
                  </div>
                </div>
                <h3 className={styles.audienceHeader}>Our Mission</h3>
                <p className={styles.infoContent}>Organization mission!</p>
                <h3 className={styles.audienceHeader}>Our History</h3>
                <p className={styles.infoContent}>Organization history!</p>
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

export default StaticPropsDetail;

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Get the paths we want to pre-render based on users
//   const paths = sampleOrgData.map((user) => ({
//     params: { id: user.id.toString() },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false };
// };

// // This function gets called at build time on server-side.
// // It won't be called on client-side, so you can even do
// // direct database queries.
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   try {
//     const id = params?.id;
//     const fetchURL = `http://localhost:3000/api/orgs/${id}`;
//     const item = await fetch(fetchURL).then((response) => response.json());
//     // By returning { props: item }, the StaticPropsDetail component
//     // will receive `item` as a prop at build time
//     return { props: { item } };
//   } catch (err) {
//     return { props: { errors: err.message } };
//   }
// };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string | undefined;

    if (!id) {
      return { notFound: true };
    }
    // await orgAPI(req, res);
    const org = await getOrganization(id);
    if (org) {
      const { createdAt: _createdAt, updatedAt: _updatedAt, ...item } = org;
      if (!item) {
        return {
          notFound: true,
        };
      }
      return {
        props: { item },
      };
    }
    return {
      notFound: true,
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
