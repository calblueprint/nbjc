import styles from './Project.module.css';

type ProjectProps = {
  name: string;
  description: string;
  image?: string;
};

const Project: React.FC<ProjectProps> = ({ name, description }) => {
  return (
    <div className={styles.project}>
      <h3 className={styles.projectTitle}>{name}</h3>
      {description}
    </div>
  );
};

export default Project;
