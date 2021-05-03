import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import styles from './HorizEventCard.module.css';

type HorizEventCardProps = {
  event: number;
};

const HorizEventCard: React.FunctionComponent<HorizEventCardProps> = ({
  event,
}) => {
  const router = useRouter();
  return (
    <div className={styles.event_cards}>
      <Card className={styles.event_card}>
        <CardActionArea onClick={() => router.push(`/orgs/4?isEvent=${true}`)}>
          <CardContent className={styles.event_card}>
            <div className={styles.card}>
              <div className={styles.left}>
                <Typography className={styles.event_date}>
                  Monday, Feb 29, 10AM PST
                </Typography>
                <Typography className={styles.event_name}>
                  Event Name
                </Typography>
                <Typography className={styles.event_date}>Location</Typography>
                <br />
                <Typography className={styles.event_description}>
                  Short Description: Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
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
