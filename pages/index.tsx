import Layout from 'components/Layout';
import { Button, ButtonGroup, TextField } from '@material-ui/core';
// eslint-disable-next-line no-use-before-define
import React from 'react';
import Box from '@material-ui/core/Box';

const Home: React.FC = () => {
  return (
    <Layout title="NBJC Home">
      <Box m={1} p={2} display="flex" justifyContent="flex-end">
        <ButtonGroup
          variant="text"
          color="primary"
          aria-label="text primary button group"
        >
          <Button variant="contained" color="primary">
            Log In
          </Button>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
        </ButtonGroup>
      </Box>
      <Box m={0} p={2} fontSize="h3.fontSize" display="flex">
        NBJC
      </Box>

      <Box borderRadius={16} m={2} p={2} bgcolor="primary.main">
        <Box display="flex" justifyContent="center">
          <ButtonGroup>
            <TextField id="outlined-basic" label="Search" variant="outlined" />
            <Button variant="contained" color="secondary">
              Go!
            </Button>
          </ButtonGroup>
        </Box>
        <p>FRED IS THE IMPOSTER!!!!!</p>
        <Button variant="contained" color="secondary">
          Hello
        </Button>
        <Box
          m={10}
          p={10}
          fontSize="h6.fontSize"
          display="flex"
          justifyContent="center"
        >
          hello darkness my old friend
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
