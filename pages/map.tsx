import Link from 'next/link';
import Layout from 'components/Layout';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A',
});

const MapPage: React.FunctionComponent = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>Map</h1>
    <p>This is the map page</p>
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
    ;
  </Layout>
);

export default MapPage;
