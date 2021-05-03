import Card from '@material-ui/core/Card';
import { CardContent, CardActionArea, Typography } from '@material-ui/core';
import { Organization } from '@prisma/client';
import clsx from 'clsx';
import styles from './OrgCard.module.css';

type CardProps = {
  org: Organization;
  selected: boolean;
};

const OrgCard: React.FunctionComponent<CardProps> = ({ org, selected }) => (
  <Card
    className={clsx({
      [styles.root]: !selected,
      [styles.rootChosen]: selected,
    })}
    classes={{
      root: styles.cardRoot,
    }}
    raised={false}
  >
    <CardActionArea>
      <div>
        <CardContent
          className={clsx({
            [styles.content]: !selected,
            [styles.contentChosen]: selected,
          })}
        >
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

export default OrgCard;
