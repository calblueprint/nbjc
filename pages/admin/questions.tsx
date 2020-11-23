import { useState } from 'react';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@material-ui/core';
import Layout from 'components/Layout';
import { sampleQuestionData } from 'utils/sample-data';
import styles from '../../styles/admin/AdminQuestions.module.css';

const AdminDashboardQuestionIndex: React.FunctionComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [questionContent, setQuestionContent] = useState('');

  // Saves a new question
  const handleSave = async (): Promise<void> => {
    // 1. Makes POST request to construct new custom question
    // 2. // Implement autosave?
    const res = await fetch('/api/question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: questionContent,
      }),
    });

    if (!res.ok) {
      console.log('Failed to save custom question.');
    }
  };

  return (
    <Layout>
      <Dialog
        onClose={() => setOpenModal(false)}
        className={styles.newModal}
        fullWidth
        open={openModal}
      >
        <DialogTitle>Add Question Prompt</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            fullWidth
            onChange={(e) => setQuestionContent(e.target.value)}
            multiline
            rows={10}
            className={styles.questionInput}
          />
          <Button
            className={styles.questionsButton}
            variant="contained"
            color="primary"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
      <AdminIndex page="Question" search="Look for a Question">
        <Button
          className={styles.questionsButton}
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add New Question
        </Button>
        <AdminTable data={sampleQuestionData} pageType="questions" />
      </AdminIndex>
    </Layout>
  );
};

export default AdminDashboardQuestionIndex;
