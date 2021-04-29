import { OrganizationEvent } from '@prisma/client';
import Image from 'next/image';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import styles from './EventCard.module.css';

type EventCardProps = {
  event: number;
};

const EventCard: React.FunctionComponent<EventCardProps> = ({ event }) => {
  const router = useRouter();
  return (
    <div className={styles.event_cards}>
      <Card className={styles.event_card}>
        <CardActionArea onClick={() => router.push(`/orgs/4?isEvent=${true}`)}>
          <CardContent className={styles.event_card}>
            {/* <div className={styles.card}> */}
            {/* <div className={styles.left}>
                        <Typography className={styles.event_date}>
                          Monday, Feb 29, 10AM PST
                        </Typography>
                        <Typography className={styles.event_name}>
                          Event Name
                        </Typography>
                        <Typography className={styles.event_date}>
                          Location
                        </Typography>
                        <br />
                        <Typography className={styles.event_description}>
                          Short Description: Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua.
                        </Typography>
                      </div>
                      <div className={styles.right} /> */}
            <div className={styles.card2}>
              <div className={styles.top}>
                <Image
                  src="/homepage.png"
                  alt="event image"
                  width={600}
                  height={100}
                />
              </div>
              <div className={styles.bottom}>
                <Typography className={styles.bottom_date}>
                  Monday, Feb 29, 10AM PST • Location
                </Typography>
                <Typography className={styles.bottom_name}>
                  Event Name
                </Typography>
                <Typography className={styles.bottom_host}>
                  Host Organization Name
                </Typography>
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default EventCard;
