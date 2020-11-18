import { Organization } from '@prisma/client';
import { CardMedia, Chip, TextField } from '@material-ui/core';
import styles from './OrgDetail.module.css';

type DetailProps = {
  items: Organization;
};

const response =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

const OrgDetail: React.FunctionComponent<DetailProps> = ({ items }) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <CardMedia
          className={styles.leftMedia}
          image={items.logo}
          title="logo"
        />
        <div className={styles.colMedia}>
          <CardMedia
            className={styles.rightMedia}
            image={items.logo}
            title="logo"
          />
          <CardMedia
            className={styles.rightMedia}
            image={items.logo}
            title="logo"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.section}>
          <div className={styles.big}>Basics</div>
          <div>Website: {items.website}</div>
          <div>EIN: {items.ein}</div>
          <div>Founded: {items.date}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Point of Contact</div>
          <div>Name: {items.contactName}</div>
          <div>Phone: {items.id}</div>
          <div>Email: {items.contactEmail}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Location</div>
          <div>Type: {items.organizationType}</div>
          <div>
            Still need sample address data: <br />
            {items.missionStatement}
          </div>
        </div>
      </div>
      <div className={styles.big}>Audience Demographics</div>
      <div className={styles.row}>
        <div className={styles.section}>
          <div className={styles.small}>Orientation</div>
          <div className={styles.chips}>
            {items.lgbtqDemographic.map((item) => (
              // TODO: Add accessibility support
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={0}>
                <Chip label={item} variant="outlined" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.small}>Ethnicity</div>
          <div className={styles.chips}>
            {items.raceDemographic.map((item) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={0}>
                <Chip label={item} variant="outlined" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.small}>Ages</div>
          <div className={styles.chips}>
            {items.ageDemographic.map((item) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={0}>
                <Chip label={item} variant="outlined" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.big}>Mission History</div>
      <div className={styles.row}>
        <TextField
          name="missionHistory"
          variant="outlined"
          multiline
          rows={6}
          placeholder={response}
          className={styles.full}
        />
      </div>
      <div className={styles.big}>More responses</div>
      <div className={styles.row}>
        <TextField
          name="missionHistory"
          variant="outlined"
          multiline
          rows={6}
          placeholder={response}
          className={styles.full}
        />
      </div>
    </div>
  );
};

export default OrgDetail;
