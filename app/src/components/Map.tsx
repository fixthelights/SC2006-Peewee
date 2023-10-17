import React, { FC } from 'react';
import GoogleMapReact from 'google-map-react';
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

interface MapProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  zoomLevel: number;
}

const Map: FC<MapProps> = ({ location, zoomLevel }) => (
  <div className="map">
    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: '' }}
        defaultCenter={{ lat: location.lat, lng: location.lng }}
        defaultZoom={zoomLevel}
      >
      </GoogleMapReact>
    </div>
  </div>
);



export default Map;
