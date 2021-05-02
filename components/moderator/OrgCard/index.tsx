import Card from '@material-ui/core/Card';
import { CardContent, CardActionArea, Typography } from '@material-ui/core';
import { Organization } from '@prisma/client';
import styles from './OrgCard.module.css';

type CardProps = {
  org: Organization;
  orgIndex: number;
  pageIndex: number;
};

const OrgCard: React.FunctionComponent<CardProps> = ({
  org,
  orgIndex,
  pageIndex,
}) => {
  if (orgIndex !== pageIndex) {
    return (
      <Card
        className={styles.root}
        classes={{
          root: styles.cardRoot,
        }}
        raised={false}
      >
        <CardActionArea>
          <div>
            <CardContent className={styles.content}>
              <Typography className={styles.date} component="h6" variant="h6">
                {org.updatedAt.toDateString()}
              </Typography>
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
  }
  return (
    <Card
      className={styles.rootChosen}
      classes={{
        root: styles.cardRoot,
      }}
      raised={false}
    >
      <CardActionArea>
        <div>
          <CardContent className={styles.contentChosen}>
            <Typography className={styles.date} component="h6" variant="h6">
              {org.updatedAt.toDateString()}
            </Typography>
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
