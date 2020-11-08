import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import styles from './Project.module.css';

type ProjectProps = {
  name: string;
  description: string;
};

const Project: React.FC<ProjectProps> = ({ name, description }) => {
  return (
    <div>
      <Card className={styles.outerBox}>
        <div className={styles.bottomTitleMargin}>{name}</div>
        <Paper variant="outlined" className={styles.innerBox}>
          {description}
        </Paper>
      </Card>
    </div>
  );
};

export default Project;
