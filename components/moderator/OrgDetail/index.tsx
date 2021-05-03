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
          <div className={styles.line}>
            <p className={styles.title}>Site: </p>{' '}
            <p className={styles.cont}>{org.contactName || 'None'}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.title}>EIN: </p>{' '}
            <p className={styles.cont}>{org.ein || 'None'}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.title}>Founded: </p>{' '}
            <p className={styles.cont}>{org.foundingDate || 'None'}</p>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Point of Contact</div>
          <div className={styles.line}>
            <p className={styles.title}>Name: </p>{' '}
            <p className={styles.cont}>{org.contactName || 'None'}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.title}>Phone: </p>{' '}
            <p className={styles.cont}>{org.contactPhone || 'None'}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.title}>Email: </p>{' '}
            <p className={styles.cont}>{org.contactEmail || 'None'}</p>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Location</div>
          <div className={styles.line}>
            <p className={styles.title}>Type: </p>{' '}
            <p className={styles.cont}>{org.organizationType || 'None'}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.cont}>{org.address || 'None'}</p>
          </div>
        </div>
      </div>
      <div className={styles.big2}>Audience Demographics</div>
      <div className={styles.row}>
        {org.lgbtqDemographic && (
          <div className={styles.section}>
            <div className={styles.title2}>Identities</div>
            <div className={styles.chips}>
              {org.lgbtqDemographic.length !== 0 ? (
                org.lgbtqDemographic.map((item) => (
                  <div key={item}>
                    <Chip
                      className={styles.chip}
                      label={item}
                      variant="outlined"
                    />
                  </div>
                ))
              ) : (
                <Chip className={styles.chip} label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
        {org.raceDemographic && (
          <div className={styles.section}>
            <div className={styles.title2}>Background</div>
            <div className={styles.chips}>
              {org.raceDemographic.length !== 0 ? (
                org.raceDemographic.map((item) => (
                  <div key={item}>
                    <Chip
                      className={styles.chip}
                      label={item}
                      variant="outlined"
                    />
                  </div>
                ))
              ) : (
                <Chip className={styles.chip} label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
        {org.ageDemographic && (
          <div className={styles.section}>
            <div className={styles.title2}>Age Range</div>
            <div className={styles.chips}>
              {org.ageDemographic.length !== 0 ? (
                org.ageDemographic.map((item) => (
                  <div key={item}>
                    <Chip
                      className={styles.chip}
                      label={item}
                      variant="outlined"
                    />
                  </div>
                ))
              ) : (
                <Chip className={styles.chip} label="None" variant="outlined" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.big2}>Description and Mission</div>
      <div className={styles.row}>{org.missionStatement || 'None'}</div>
      <div className={styles.big2}>History</div>
      <div className={styles.row}>{org.shortHistory || 'None'}</div>
      {org.applicationResponses.map(
        (qnr): JSX.Element => {
          return (
            <div key={qnr.id}>
              <div className={styles.big2}>
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
