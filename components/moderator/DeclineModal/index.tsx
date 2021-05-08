import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect, useState } from 'react';
import styles from './DeclineModal.module.css';

type Props = {
  id: number;
  openModal: boolean;
  closeModal: () => void;
  declineAction: (text: string) => void;
  note: string | null | undefined;
};

const DeclineModal: React.FC<Props> = ({
  id,
  openModal,
  closeModal,
  declineAction,
  note,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText('');
  }, [id]);

  return (
    <Dialog
      onClose={closeModal}
      fullWidth
      maxWidth={note ? 'md' : 'sm'}
      open={openModal}
    >
      <DialogTitle>
        <div className={styles.dialogTitle}>
          Reason For Declining
          <IconButton aria-label="close" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={styles.modContent}>
          {note ? (
            <div className={styles.modTab}>
              <div className={styles.declineNotes}>Notes</div>
              <div className={styles.declineNotesContent}>{note}</div>
            </div>
          ) : null}
          <div className={styles.declineBox}>
            <TextField
              id="outlined-basic"
              label="Reasons for declining."
              variant="outlined"
              multiline
              size="small"
              rows={13}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.declineReason}
            />
          </div>
        </div>
        <div className={styles.send}>
          <Button
            variant="outlined"
            disableElevation
            color="primary"
            onClick={() => {
              closeModal();
              declineAction(text);
            }}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeclineModal;
