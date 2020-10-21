import Card from '@material-ui/core/Card';
import {
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@material-ui/core';
import { OrgApp } from 'interfaces';
import styles from './OrgCard.module.css';

type CardProps = {
  items: OrgApp;
};

const OrgCard: React.FunctionComponent<CardProps> = ({ items }) => {
  return (
    <Card className={styles.root}>
      <CardActionArea>
        <div className={styles.cardMain}>
          <CardMedia
            className={styles.media}
            image={items.logo}
            title="Contemplative Reptile"
          />
          <CardContent className={styles.content}>
            <Typography component="h5" variant="h5">
              {items.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {items.description}
            </Typography>
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default OrgCard;
