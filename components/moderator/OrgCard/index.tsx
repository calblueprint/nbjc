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
  org: Organization;
};

const OrgCard: React.FunctionComponent<CardProps> = ({ org }) => {
  return (
    <Card className={styles.root}>
      <CardActionArea>
        <div className={styles.cardMain}>
          {org.name && (
            <CardMedia
              className={styles.media}
              image={org.name}
              title="Contemplative Reptile"
            />
          )}
          <CardContent className={styles.content}>
            {org.name && (
              <Typography component="h5" variant="h5">
                {org.name}
              </Typography>
            )}
            {org.missionStatement && (
              <Typography variant="subtitle1" color="textSecondary">
                {org.missionStatement}
              </Typography>
            )}
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default OrgCard;
