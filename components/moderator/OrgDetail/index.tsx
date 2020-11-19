import { PrismaClient, Organization } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { CardMedia, Chip, TextField } from '@material-ui/core';
import styles from './OrgDetail.module.css';

type DetailProps = {
  items: Organization;
};

const prisma = new PrismaClient();

const response =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

const OrgDetail: React.FunctionComponent<DetailProps> = ({ items }) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {items && (
          <CardMedia
            className={styles.leftMedia}
            image="/logo2.png"
            title="logo"
          />
        )}
        <div className={styles.colMedia}>
          {items && (
            <CardMedia
              className={styles.rightMedia}
              image="/logo2.png"
              title="logo"
            />
          )}
          {items && (
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
          {items.contactName && <div>Website: {items.contactName}</div>}
          {items.ein && <div>EIN: {items.ein}</div>}
          {items.createdAt && <div>Founded: {items.createdAt}</div>}
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Point of Contact</div>
          {items.contactName && <div>Name: {items.contactName}</div>}
          {items.id && <div>Phone: {items.id}</div>}
          {items.contactEmail && <div>Email: {items.contactEmail}</div>}
        </div>
        <div className={styles.section}>
          <div className={styles.big}>Location</div>
          {items.organizationType && <div>Type: {items.organizationType}</div>}
          {items.missionStatement && (
            <div>
              Still need sample address data: <br />
              {items.missionStatement}
            </div>
          )}
        </div>
      </div>
      <div className={styles.big}>Audience Demographics</div>
      <div className={styles.row}>
        {items.lgbtqDemographic && (
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
        )}
        {items.raceDemographic && (
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
        )}
        {items.ageDemographic && (
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
        )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res: Organization[] = await prisma.organization.findMany();
  const items = JSON.parse(JSON.stringify(res));
  return { props: { items } };
};

export default OrgDetail;
