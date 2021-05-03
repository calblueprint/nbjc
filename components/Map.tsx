/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ReactMapGL, { Marker, Popup, ViewportProps } from 'react-map-gl';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import { Prisma, Organization, OrganizationEvent } from '@prisma/client';
import { orgProfile } from 'interfaces/organization';
import { Button, ClickAwayListener } from '@material-ui/core';

import styles from '../styles/Map.module.css';

type MapProps = {
  objs: Organization[] | OrganizationEvent[];
};

type ViewportStateProps = {
  lati?: number | null;
  longi?: number | null;
  setSelectedObj: (obj: any) => void;
  selectedObj: OrganizationEvent | Organization | null;
  setViewport: (newViewport: ViewportProps) => void;
  viewport: ViewportStateProps | ViewportProps;
};

const Map: React.FunctionComponent<MapProps & ViewportStateProps> = ({
  objs,
  lati,
  longi,
  setSelectedObj,
  selectedObj,
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
    setSelectedObj(null);
  };
  const isOrganization = (
    obj: Organization | OrganizationEvent
  ): obj is Organization => {
    if ((obj as Organization).name) return true;
    return false;
  };
  return (
    <ReactMapGL
      className={styles.border}
      mapStyle="mapbox://styles/nbjc-calblueprint/ckhn0b28l04yz1apxewszuevn"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onViewportChange={(newViewport) => setViewport(newViewport)}
      {...viewport}
    >
      {objs
        ? objs.map((obj: Organization | OrganizationEvent) => {
            return obj.lat && obj.long ? (
              <div key={obj.id}>
                <Marker latitude={obj.lat} longitude={obj.long}>
                  <span
                    onMouseEnter={() => setSelectedObj(obj)}
                    role="img"
                    aria-label="push-pin"
                  >
                    <LocationOnRoundedIcon
                      className={
                        selectedObj?.id === obj.id
                          ? styles.iconClicked
                          : styles.icon
                      }
                    />
                  </span>
                </Marker>
                {selectedObj?.id === obj.id ? (
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <Popup
                      // onClose={() => setSelectedOrg(null)}
                      latitude={obj.lat}
                      longitude={obj.long}
                      className={styles.popupMap}
                    >
                      <Button href={`${obj.id}`} className={styles.popup}>
                        {isOrganization(obj) ? obj.name : obj.title}
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
