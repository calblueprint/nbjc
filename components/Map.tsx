import { useState } from 'react';
import ReactMapGL, { ViewportProps } from 'react-map-gl';

type ViewportStateProps = {
  width: number | string;
  height: number | string;
};

const Map: React.FunctionComponent<ViewportStateProps> = () => {
  const [viewport, setViewport] = useState<ViewportStateProps | ViewportProps>({
    width: '100%',
    height: '100%',
    latitude: 37.8712,
    longitude: -122.2601,
    zoom: 12,
  });
  return (
    <ReactMapGL
      mapStyle="mapbox://styles/nbjc-calblueprint/ckhn0b28l04yz1apxewszuevn"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onViewportChange={(newViewport) => setViewport(newViewport)}
      {...viewport}
    />
  );
};

export default Map;
