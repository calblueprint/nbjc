/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ReactMapGL, { Marker, Popup, ViewportProps } from 'react-map-gl';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import { Prisma, Organization } from '@prisma/client';
import { orgProfile } from 'interfaces/organization';
import { Button, ClickAwayListener } from '@material-ui/core';

import styles from '../styles/Map.module.css';

type MapProps = {
  orgs: Organization[];
};

type ViewportStateProps = {
  width: number;
  height: number;
  lati: number | null;
  longi: number | null;
  setSelectedOrg: React.EventHandler;
  selectedOrg: Organization | null;
  setViewport: React.EventHandler;
  viewport: ViewportStateProps | ViewportProps;
};

const Map: React.FunctionComponent<MapProps & ViewportStateProps> = ({
  orgs,
  width,
  height,
  lati,
  longi,
  setSelectedOrg,
  selectedOrg,
  viewport,
  setViewport,
}) => {
  // const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  /* const lat = lati || orgs[0].lat || 37.8712;
  const lon = longi || orgs[0].long || -122.2601;
  const z = orgs[0] ? 9 : 0;
  const [viewport, setViewport] = useState<ViewportStateProps | ViewportProps>({
    width: "100%",
    height: "100%",
    latitude: lat,
    longitude: lon,
    zoom: z,
  }); */
  const handleClickAway = () => {
    setSelectedOrg(null);
  };
  return (
    <ReactMapGL
      className={styles.border}
      mapStyle="mapbox://styles/nbjc-calblueprint/ckhn0b28l04yz1apxewszuevn"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onViewportChange={(newViewport) => setViewport(newViewport)}
      {...viewport}
    >
      {orgs
        ? orgs.map((org) => {
            return org.lat && org.long ? (
              <div key={org.id}>
                <Marker latitude={org.lat} longitude={org.long}>
                  <span
                    onMouseEnter={() => setSelectedOrg(org)}
                    role="img"
                    aria-label="push-pin"
                  >
                    <LocationOnRoundedIcon
                      className={
                        selectedOrg?.id === org.id
                          ? styles.iconClicked
                          : styles.icon
                      }
                    />
                  </span>
                </Marker>
                {selectedOrg?.id === org.id ? (
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <Popup
                      // onClose={() => setSelectedOrg(null)}
                      latitude={org.lat}
                      longitude={org.long}
                      className={styles.popupMap}
                    >
                      <Button href={`${org.id}`} className={styles.popup}>
                        {org.name}
                      </Button>
                    </Popup>
                  </ClickAwayListener>
                ) : null}
              </div>
            ) : null;
          })
        : null}
    </ReactMapGL>
  );
};

export default Map;
