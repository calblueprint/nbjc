<script src='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
import Layout from 'components/Layout';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiY2luZHl6aGFuZzciLCJhIjoiY2tmdXFsMHhiMHVxbjJ6cXFpNjlqYjBwdSJ9.p-mWz2ectUNc4X-ZdGkeSw',
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
