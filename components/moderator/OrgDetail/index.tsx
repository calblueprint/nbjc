import { Organization } from '@prisma/client';
import { CardMedia, Chip } from '@material-ui/core';
import styles from './OrgDetail.module.css';

type DetailProps = {
  org: Organization;
};

const response =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

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
          {org.contactName && <div>Website: {org.contactName}</div>}
          {org.ein && <div>EIN: {org.ein}</div>}
          {org.createdAt && <div>Founded: {org.createdAt}</div>}
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Point of Contact</div>
          {org.contactName && <div>Name: {org.contactName}</div>}
          {org.id && <div>Phone: {org.id}</div>}
          {org.contactEmail && <div>Email: {org.contactEmail}</div>}
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Location</div>
          {org.organizationType && <div>Type: {org.organizationType}</div>}
          {org.missionStatement && (
            <div>
              Still need sample address data: <br />
              {org.missionStatement}
            </div>
          )}
        </div>
      </div>
      <div className={styles.big}>Audience Demographics</div>
      <div className={styles.row}>
        {org.lgbtqDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Orientation</div>
            <div className={styles.chips}>
              {org.lgbtqDemographic.map((item) => (
                <div key={0}>
                  <Chip label={item} variant="outlined" />
                </div>
              ))}
            </div>
          </div>
        )}
        {org.raceDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Ethnicity</div>
            <div className={styles.chips}>
              {org.raceDemographic.map((item) => (
                <div key={0}>
                  <Chip label={item} variant="outlined" />
                </div>
              ))}
            </div>
          </div>
        )}
        {org.ageDemographic && (
          <div className={styles.section}>
            <div className={styles.small}>Ages</div>
            <div className={styles.chips}>
              {org.ageDemographic.map((item) => (
                <div key={0}>
                  <Chip label={item} variant="outlined" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.big}>Mission History</div>
      <div className={styles.row}>{response}</div>
      <div className={styles.big}>More responses</div>
      <div className={styles.row}>{response}</div>
    </div>
  );
};

export default OrgDetail;
