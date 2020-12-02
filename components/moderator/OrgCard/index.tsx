import Card from '@material-ui/core/Card';
import { CardContent, CardActionArea, Typography } from '@material-ui/core';
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
          <CardContent className={styles.content}>
            {org.name && (
              <Typography component="h5" variant="h5">
                {org.name}
              </Typography>
            )}
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default OrgCard;
