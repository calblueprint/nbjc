import Layout from 'components/Layout';
import { Button, CircularProgress } from '@material-ui/core';
import styles from '../styles/Home.module.css';
import ReactMapboxGl from "react-mapbox-gl";


const Home: React.FC = () => {
  return (
    <Layout title="NBJC Home">
      <h1>Home</h1>
      <p>FRED IS THE IMPOSTER!!!!!</p>
      <Button variant="contained" color="primary">
        Hello
      </Button>
      <CircularProgress />
      <Map
      style={{ mapbox: '//styles/mapbox/streets-v9' }}
      containerStyle={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      </Layer>
    </Map>
    </Layout>
  );
};

export default Home;
