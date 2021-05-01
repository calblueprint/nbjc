import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Link,
  Chip,
} from '@material-ui/core';
import { Organization, OrganizationProject } from '@prisma/client';
import styles from './EventCard.module.css';

type CardProps = {
  // delete '?' when backend implemeneted
  event: OrganizationProject;
};

const EventCard: React.FunctionComponent<CardProps> = ({ event }) => {
  // dummy data START
  //    needs to be filled w correct backend
  const img = './public/sampleCover.png'; // SAMPLE DATA
  const date = '[TEST] Monday, Feb 29, 10AM PST'; // SAMPLE DATA
  const location = '[TEST] Location'; // SAMPLE DATA
  const name = event.title;
  const link = '[TEST] link.to.external'; // SAMPLE DATA
  const description = (
    <div>
      <p>{event.description}</p>
    </div>
  );
  const identities = ['LGBTQ+', 'SQL']; // SAMPLE DATA
  const background = ['POC', 'Black', 'Asian']; // SAMPLE DATA
  const ages = ['Adult', 'Teen', 'Child', 'Senior']; // SAMPLE DATA
  // dummy data END
  const demographics = (category: string, groups: string[]): JSX.Element => {
    return (
      <div className={styles.demographic}>
        <div className={styles.demTitle}>{category}</div>
        <div className={styles.demographicTags}>
          {groups.length !== 0 ? (
            groups.map((group) => (
              <Chip
                className={styles.demTag}
                key={group}
                label={group}
                variant="outlined"
              />
            ))
          ) : (
            <Chip label="None" variant="outlined" />
          )}
        </div>
      </div>
    );
  };
  return (
    <Card>
      <CardActionArea>
        <div className={styles.imgContainer}>
          <img
            className={styles.img}
            src="https://1mktxg24rspz19foqjixu9rl-wpengine.netdna-ssl.com/wp-content/uploads/2020/01/eia-berkeley-Cover.png"
            alt="Event"
          />
        </div>
        <CardContent className={styles.content}>
          <div className={styles.info}>
            <Typography className={styles.dateLoc} variant="h5" component="h1">
              {date} at {location}
            </Typography>
            <Typography
              className={styles.eventName}
              variant="h5"
              component="h2"
            >
              {name}
            </Typography>
            <Link className={styles.linkText} href={link}>
              {link}
            </Link>
          </div>
          <div className={styles.description}>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
          </div>
          <div className={styles.demographicSection}>
            {demographics('Identities', identities)}
            {demographics('Background', background)}
            {demographics('Ages', ages)}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
