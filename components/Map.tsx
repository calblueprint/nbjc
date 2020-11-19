/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ReactMapGL, { Marker, Popup, ViewportProps } from 'react-map-gl';
import { PublicOrganization } from 'interfaces/organization';

type MapProps = {
  orgs: PublicOrganization[];
};

type ViewportStateProps = {
  width: number | string;
  height: number | string;
};

const Map: React.FunctionComponent<MapProps & ViewportStateProps> = ({
  orgs,
  width,
  height,
}) => {
  const [selectedOrg, setSelectedOrg] = useState<PublicOrganization | null>(
    null
  );
  const [viewport, setViewport] = useState<ViewportStateProps | ViewportProps>({
    width,
    height,
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
    >
      {orgs.map((org) => {
        return org.lat && org.long ? (
          <div key={org.id}>
            <Marker latitude={org.lat} longitude={org.long}>
              <span
                onClick={() => setSelectedOrg(org)}
                role="img"
                aria-label="push-pin"
              >
                📌
              </span>
            </Marker>
            {selectedOrg?.id === org.id ? (
              <Popup
                onClose={() => setSelectedOrg(null)}
                closeOnClick
                latitude={org.lat}
                longitude={org.long}
              >
                {org.name}
              </Popup>
            ) : null}
          </div>
        ) : null;
      })}
    </ReactMapGL>
  );
};

export default Map;
