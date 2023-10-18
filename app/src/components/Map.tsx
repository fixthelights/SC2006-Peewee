import React, { FC, useState } from 'react';
import {GoogleMap, Marker, InfoWindowF, useLoadScript} from '@react-google-maps/api';
import { useMemo } from "react";
import { Icon } from '@iconify/react';
import locationIcon from '@iconify/icons-mdi/map-marker';

import './map.css';

interface LocationPinProps {
  lat: number;
  lng: number;
  text: string;
}

const LocationPin: FC<LocationPinProps> = ({ lat, lng, text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
);

interface CameraArray{
  cameraName: string,
  lng: number,
  lat: number,
  vehicleCount: number
}

interface MapProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  zoomLevel: number;
  cameras: CameraArray[]
}

const Map: FC<MapProps> = ({ location, zoomLevel, cameras }) => {
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<{id: number, camera: CameraArray}>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDm-rTxw55HDBTGxVL5kbYVtQjqHVIiPCE',
  });

  const onMapLoad = (map : google.maps.Map) => {
    setMapRef(map);
  };

  const center = useMemo(() => ({ lat: location.lat, lng: location.lng }), []);

  const marker = (
    <Marker
      position={{ lat: 18.52043, lng: 73.856743 }}
      icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
    />
  );

  const handleMarkerClick = (id :number, camera: CameraArray) => {
    mapRef?.panTo({ lat: camera.lat, lng: camera.lng });
    setInfoWindowData({ id, camera});
    setIsOpen(true);
  }

  return (
    <div className="map">
    {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={12}
          onLoad={onMapLoad}
        >
          {cameras.map((camera: CameraArray, ind)=> (
            <Marker 
              key={ind}
              position={{ lat: camera.lat, lng: camera.lng}}
              onClick={() => handleMarkerClick(ind, camera)}
            >
              {isOpen && infoWindowData?.id === ind && (
                <InfoWindowF
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <React.Fragment>
                    <h3>{infoWindowData.camera.cameraName}</h3>
                    <p>Vehicle Count: {infoWindowData.camera.vehicleCount}</p>
                  </React.Fragment>
                </InfoWindowF>
              )};
            </Marker>

          ))};
        </GoogleMap>
      )}
  </div>
  );
};



export default Map;
