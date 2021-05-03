/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ReactMapGL, { Marker, Popup, ViewportProps } from 'react-map-gl';
import { Prisma, Organization, OrganizationEvent } from '@prisma/client';
import { orgProfile } from 'interfaces/organization';

type MapProps = {
  objs: Organization[] | OrganizationEvent[];
};

type ViewportStateProps = {
  width: number | string;
  height: number | string;
};

const Map: React.FunctionComponent<MapProps & ViewportStateProps> = ({
  objs,
  width,
  height,
}) => {
  const [selectedObj, setSelectedObj] = useState<
    Organization | OrganizationEvent | null
  >(null);
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
      {objs
        ? objs.map((obj) => {
            return obj.lat && obj.long ? (
              <div key={obj.id}>
                <Marker latitude={obj.lat} longitude={obj.long}>
                  <span
                    onClick={() => setSelectedObj(obj)}
                    role="img"
                    aria-label="push-pin"
                  >
                    📌
                  </span>
                </Marker>
                {selectedObj?.id === obj.id ? (
                  <Popup
                    onClose={() => setSelectedObj(null)}
                    closeOnClick
                    latitude={obj.lat}
                    longitude={obj.long}
                  >
                    {obj.name}
                  </Popup>
                ) : null}
              </div>
            ) : null;
          })
        : null}
    </ReactMapGL>
  );
};

export default Map;
