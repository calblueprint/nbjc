import Card from '@material-ui/core/Card';
import {
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@material-ui/core';
import { Organization } from '@prisma/client';
import styles from './OrgCard.module.css';

type CardProps = {
  items: Organization;
};

const OrgCard: React.FunctionComponent<CardProps> = ({ items }) => {
  return (
    <Card className={styles.root}>
      <CardActionArea>
        <div className={styles.cardMain}>
          {items.name && (
            <CardMedia
              className={styles.media}
              image={items.name}
              title="Contemplative Reptile"
            />
          )}
          <CardContent className={styles.content}>
            {items.name && (
              <Typography component="h5" variant="h5">
                {items.name}
              </Typography>
            )}
            {items.missionStatement && (
              <Typography variant="subtitle1" color="textSecondary">
                {items.missionStatement}
              </Typography>
            )}
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default OrgCard;
