import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { OrgApp } from 'interfaces';
import styles from 'styles/OrgCard.module.css';
import CardActionArea from '@material-ui/core/CardActionArea';

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
            title="logo title"
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
