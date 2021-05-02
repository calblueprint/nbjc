import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import styles from './VertEventCard.module.css';

type VertEventCardProps = {
  event: number;
};

const VertEventCard: React.FunctionComponent<VertEventCardProps> = ({
  event,
}) => {
  const router = useRouter();
  return (
    <div className={styles.event_cards}>
      <Card className={styles.event_card}>
        <CardActionArea onClick={() => router.push(`/orgs/4?isEvent=${true}`)}>
          <CardContent className={styles.event_card}>
            <div className={styles.top}>
              <Image
                src="/gradient.png"
                alt="event image"
                width={380}
                height={100}
              />
            </div>
            <div className={styles.bottom}>
              <Typography className={styles.bottom_date}>
                Monday, Feb 29, 10AM PST • Location
              </Typography>
              <Typography className={styles.bottom_name}>Event Name</Typography>
              <Typography className={styles.bottom_host}>
                Host Organization Name
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default VertEventCard;
