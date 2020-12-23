import { ApplicationResponse, Organization } from '@prisma/client';
import { CardMedia, Chip } from '@material-ui/core';
import styles from './OrgDetail.module.css';

type DetailProps = {
  org: Organization & {
    applicationResponses: (ApplicationResponse & {
      applicationQuestion: { question: string };
    })[];
  };
};

const OrgDetail: React.FunctionComponent<DetailProps> = ({ org }) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {org && (
          <CardMedia
            className={styles.leftMedia}
            image="/logo2.png"
            title="logo"
          />
        )}
        <div className={styles.colMedia}>
          {org && (
            <CardMedia
              className={styles.rightMedia}
              image="/logo2.png"
              title="logo"
            />
          )}
          {org && (
            <CardMedia
              className={styles.rightMedia}
              image="/logo2.png"
              title="logo"
            />
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.section}>
          <div className={styles.big}>Basics</div>
          <div>Website: {org.contactName || 'None'}</div>
          <div>EIN: {org.ein || 'None'}</div>
          <div>Founded: {org.foundingDate || 'None'}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Point of Contact</div>
          <div>Name: {org.contactName || 'None'}</div>
          <div>Phone: {org.id || 'None'}</div>
          <div>Email: {org.contactEmail || 'None'}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Location</div>
          <div>Type: {org.organizationType || 'None'}</div>
          <div>{'123 Street Name City, SA 12345' || 'None'}</div>
        </div>
      </div>
      <div className={styles.big}>Audience Demographics</div>
      <div className={styles.row}>
        {org.lgbtqDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Orientation</div>
            <div className={styles.chips}>
              {org.lgbtqDemographic.length !== 0 ? (
                org.lgbtqDemographic.map((item) => (
                  <div key={item}>
                    <Chip label={item} variant="outlined" />
                  </div>
                ))
              ) : (
                <Chip label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
        {org.raceDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Ethnicity</div>
            <div className={styles.chips}>
              {org.raceDemographic.length !== 0 ? (
                org.raceDemographic.map((item) => (
                  <div key={item}>
                    <Chip label={item} variant="outlined" />
                  </div>
                ))
              ) : (
                <Chip label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
        {org.ageDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Ages</div>
            <div className={styles.chips}>
              {org.ageDemographic.length !== 0 ? (
                org.ageDemographic.map((item) => (
                  <div key={item}>
                    <Chip label={item} variant="outlined" />
                  </div>
                ))
              ) : (
                <Chip label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.big}>Description and Mission</div>
      <div className={styles.row}>{org.missionStatement || 'None'}</div>
      <div className={styles.big}>History</div>
      <div className={styles.row}>{org.shortHistory || 'None'}</div>
      {org.applicationResponses.map(
        (qnr): JSX.Element => {
          return (
            <div key={qnr.id}>
              <div className={styles.big}>
                {qnr.applicationQuestion.question}
              </div>
              <div className={styles.row}>{qnr.answer}</div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default OrgDetail;
