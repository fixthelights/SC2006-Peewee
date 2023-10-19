import React, { FC, useState } from 'react';
import {GoogleMap, Marker, InfoWindowF, useLoadScript, DirectionsRenderer} from '@react-google-maps/api';
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

interface Camera{
  cameraName: string,
  lng: number,
  lat: number,
  vehicleCount: number
  peakedness: number | null
}

interface MapProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  zoomLevel: number;
<<<<<<< Updated upstream
  cameras: Camera[]
=======
  cameras: Camera[];
  directionsResponse: google.maps.DirectionsResult | null;
  
>>>>>>> Stashed changes
}

const Map: FC<MapProps> = ({ location, zoomLevel, cameras, directionsResponse }) => {
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<{id: number, camera: Camera}>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCn6_wKG_mP0YI_eVctQ5zB50VuwMmzoWQ',
    libraries: ['places']
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

  const handleMarkerClick = (id :number, camera: Camera) => {
    mapRef?.panTo({ lat: camera.lat, lng: camera.lng });
    setInfoWindowData({ id, camera});
    setIsOpen(true);
  }

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  const peaknessIcon = (peakedness: number | null) => {
    let url;

    if(peakedness === null){
      return {
        url: "http://maps.google.com/mapfiles/ms/icons/question.png",
        scaledSize: new google.maps.Size(40,40)
      }
    }

    if(peakedness > 0.80){
      url= "http://maps.google.com/mapfiles/ms/icons/red.png";
    }else if(peakedness <= 0.80 && peakedness > 0.60){
      url = "http://maps.google.com/mapfiles/ms/icons/orange.png";
    }else{
      url = "http://maps.google.com/mapfiles/ms/icons/green.png";
    }

    return {
      url: url,
      scaledSize: new google.maps.Size(40,40)
    }
  }

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
          {cameras.map((camera: Camera, ind)=> (
            <Marker 
              key={ind}
              position={{ lat: camera.lat, lng: camera.lng}}
              onClick={() => handleMarkerClick(ind, camera)}
              icon={peaknessIcon(camera.peakedness)}
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
                    {infoWindowData.camera.peakedness != null && (
                      <p>Peakedness: {`${(infoWindowData.camera.peakedness * 100).toFixed(1)}%`}</p>
                    )}
                  </React.Fragment>
                </InfoWindowF>
              )};
            </Marker>

          ))};
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      )}
  </div>
  );
};



export default Map;
