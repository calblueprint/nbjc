import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Link,
  Chip,
} from '@material-ui/core';
import { Organization, OrganizationEvent } from '@prisma/client';
import computeDate from 'utils/computeDate';
import styles from './EventCard.module.css';

type CardProps = {
  event: OrganizationEvent;
};

const EventCard: React.FunctionComponent<CardProps> = ({ event }) => {
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
            {computeDate(event.startDateTime, 1)} at {event.address}
            {event.address}
          </Typography>
          <Typography className={styles.eventName} variant="h5" component="h2">
            {event.title}
          </Typography>
          <Link className={styles.linkText} href={event.link || ''}>
            {event.link}
          </Link>
        </div>
        <div className={styles.description}>
          <Typography variant="body2" component="p">
            <div>
              <p>{event.description}</p>
            </div>
          </Typography>
        </div>
        <div className={styles.demographicSection}>
          {demographics('Identities', event.lgbtqDemographic)}
          {demographics('Background', event.raceDemographic)}
          {demographics('Ages', event.ageDemographic)}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
