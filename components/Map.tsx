import { useState } from 'react';
import ReactMapGL, { ViewportProps } from 'react-map-gl';

type ViewportStateProps = {
  width: number | string;
  height: number | string;
};

const Map: React.FC = () => {
  const [viewport, setViewport] = useState<ViewportStateProps | ViewportProps>({
    width: 100,
    height: 100,
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
