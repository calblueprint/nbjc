import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Organization } from 'interfaces';
import { sampleOrgData } from 'utils/sample-data';
import Layout from 'components/Layout';
import styles from '../../styles/Organization.module.css';
import KeyWord from '../../components/organization/KeyWord/index';
import Project from '../../components/organization/Project/index';

type Props = {
  item?: Organization;
  errors?: string;
};

const keyWords = ['Grassroots', 'POC All', 'LGBTQ+ All'];
const keyWordsList = keyWords.map((keyWord) => {
  return <KeyWord word={keyWord} />;
});

const projects = [
  {
    name: '1project',
    description:
      'it was a project, in fact, a really great project, perhaps the greatest project of all time. no one has ever seen such a project.',
  },
  {
    name: '2 project',
    description:
      'it was a project, in fact, a really great project, perhaps the greatest project of all time. no one has ever seen such a project.',
  },
  {
    name: '3 project',
    description:
      'it was a project, in fact, a really great project, perhaps the greatest project of all time. no one has ever seen such a project.',
  },
  {
    name: '4 project',
    description:
      'it was a project, in fact, a really great project, perhaps the greatest project of all time. no one has ever seen such a project.',
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
            onClick={console.log('do nothing')}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        </div>
        <div className={styles.titleColumns}>
          <div className={styles.leftColumn}>
            <h1 className={styles.Header}>{item.name}</h1>
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
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.headerButton}>
              <ButtonGroup
                variant="contained"
                color="primary"
                disableElevation
                className={styles.buttonGroup}
              >
                <Button
                  className={styles.buttonInd}
                  onClick={() => setshowInfo(true)}
                >
                  Information
                </Button>
                <Button
                  className={styles.buttonInd}
                  onClick={() => setshowInfo(false)}
                >
                  Project and Events
                </Button>
              </ButtonGroup>
            </div>
            {showInfo ? (
              <div className={styles.rightContent}>
                <h3 className={styles.audienceHeader}>Audience Demographics</h3>
                <h3 className={styles.audienceHeader}>Our Mission</h3>
                <p className={styles.infoContent}>Organization mission!</p>
                <h3 className={styles.audienceHeader}>Our History</h3>
                <p className={styles.infoContent}>Organization history!</p>
              </div>
            ) : (
              projectsList
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaticPropsDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  const paths = sampleOrgData.map((user) => ({
    params: { id: user.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const fetchURL = `http://localhost:3000/api/orgs/${id}`;
    const item = await fetch(fetchURL).then((response) => response.json());
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
