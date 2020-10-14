import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

const Map: React.FC = () => {
  const [viewport, setViewport] = useState({
    width: 50000000, // large number to fit the box?
    height: 400,
    latitude: 41.5868,
    longitude: -93.625,
    zoom: 13,
  });
  return (
    <ReactMapGL
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onViewportChange={(newViewport) => setViewport(newViewport)}
      {...viewport}
    />
  );
};

export default Map;
