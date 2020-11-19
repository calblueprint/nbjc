import Paper from '@material-ui/core/Paper';
import styles from './KeyWord.module.css';

type KeyWordProps = {
  word: string;
};

const KeyWord: React.FC<KeyWordProps> = ({ word }) => {
  return (
    <div className={styles.wordMargin}>
      <Paper variant="outlined" className={styles.wordBox}>
        {word}
      </Paper>
    </div>
  );
};

export default KeyWord;
