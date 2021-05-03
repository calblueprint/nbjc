import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { OrganizationEvent } from '@prisma/client';
import computeDate from 'utils/computeDate';
import styles from './HorizEventCard.module.css';

type HorizEventCardProps = {
  event: OrganizationEvent;
};

const HorizEventCard: React.FunctionComponent<HorizEventCardProps> = ({
  event,
}) => {
  const router = useRouter();
  return (
    <div className={styles.event_cards}>
      <Card className={styles.event_card}>
        <CardActionArea
          onClick={() =>
            window.open(`/orgs/${event.organizationId}?isEvent=${true}`)
          }
        >
          <CardContent className={styles.event_card}>
            <div className={styles.card}>
              <div className={styles.left}>
                <Typography className={styles.event_date}>
                  {computeDate(event.startDatetime, 1)}
                </Typography>
                <Typography className={styles.event_name}>
                  {event.title}
                </Typography>
                <Typography className={styles.event_date}>
                  {event.address}
                </Typography>
                <br />
                <Typography className={styles.event_description}>
                  {event.description}
                </Typography>
              </div>
              <div className={styles.right}>
                <Image
                  src="/gradient.png"
                  alt="event image"
                  width={300}
                  height={300}
                />
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default HorizEventCard;
