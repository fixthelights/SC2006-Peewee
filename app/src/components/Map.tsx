import React, { FC, useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useLoadScript,
  DirectionsRenderer,
  Libraries,
} from "@react-google-maps/api";
import { useMemo } from "react";
import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/map-marker";

import "./map.css";

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

enum IncidentType {
  accident = "Accident",
  roadWork = "RoadWork",
  roadClosure = "RoadClosure",
}

interface Report {
  incident: IncidentType,
  location: {
    long: number;
    lat: number;
  };
  address: string;
  description: string;
  time: string;
  reported_by: string;
}

interface Camera {
  cameraName: string;
  lng: number;
  lat: number;
  vehicleCount: number;
  peakedness: number | null;
}

interface MapProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  zoomLevel: number;
  cameras: Camera[];
  incidents?: Report[];
  directionsResponse?: google.maps.DirectionsResult | null;

  showCameras?: boolean;
  showAccidents?: boolean;
  showRoadWorks?: boolean;
  showRoadClosures?: boolean;
}

interface InfoData {
  location: {
    lat: number;
    lng: number;
  }
}

// Move array outside of functional component
// See https://github.com/JustFly1984/react-google-maps-api/issues/238
const libraries: Libraries = ['places'];

const Map: FC<MapProps> = ({
  location,
  zoomLevel = 12,
  cameras,
  incidents,
  directionsResponse,
  showCameras= true,
  showAccidents= false,
  showRoadWorks= false,
  showRoadClosures= false,
}) => {
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<{
    id: string;
    data: InfoData;
  }>();

  

  useEffect(()=>{
    setIsOpen(false);
  },[showCameras,showAccidents,showRoadWorks,showRoadClosures]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCn6_wKG_mP0YI_eVctQ5zB50VuwMmzoWQ",
    libraries: libraries // Move array outside of functional component
  });

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  const center = useMemo(() => ({ lat: location.lat, lng: location.lng }), []);

  const handleMarkerClick = (id: string, data: InfoData) => {
    mapRef?.panTo({ lat: data.location.lat, lng: data.location.lng });
    setInfoWindowData({ id, data });
    setIsOpen(true);
  };

  const peaknessIcon = (peakedness: number | null) => {
    let url;

    if (peakedness === null) {
      return {
        url: "http://maps.google.com/mapfiles/ms/icons/question.png",
        scaledSize: new google.maps.Size(40, 40),
      };
    }

    if (peakedness > 0.8) {
      url = "http://maps.google.com/mapfiles/ms/icons/red.png";
    } else if (peakedness <= 0.8 && peakedness > 0.6) {
      url = "http://maps.google.com/mapfiles/ms/icons/orange.png";
    } else {
      url = "http://maps.google.com/mapfiles/ms/icons/green.png";
    }

    return {
      url: url,
      scaledSize: new google.maps.Size(40, 40),
    };
  };

  const incidentIcon = (incidentType: IncidentType) => {
    let url;

    if (incidentType === IncidentType.accident) {
      url = "http://maps.gstatic.com/mapfiles/ms2/micons/firedept.png";
    } else if (incidentType === IncidentType.roadWork) {
      url = "http://maps.gstatic.com/mapfiles/ms2/micons/caution.png";
    } else if (incidentType === IncidentType.roadClosure) {
      url = "http://maps.gstatic.com/mapfiles/ms2/micons/earthquake.png";
    } else {
      url = "http://maps.google.com/mapfiles/ms/icons/question.png";
    }

    return {
      url: url,
      scaledSize: new google.maps.Size(50, 50),
    };
  };

  const plotCameraMarkers = (camera: Camera, ind: number) => {
    const index = `cam${ind}`

    const infoData: InfoData = {
      location: {
        lng: camera.lng,
        lat: camera.lat
      }
    }
    return (
    <MarkerF
      key={index}
      position={{ lat: camera.lat, lng: camera.lng }}
      onClick={() => handleMarkerClick(index, infoData)}
      icon={peaknessIcon(camera.peakedness)}
    >
      {isOpen && infoWindowData?.id === index && (
        <InfoWindowF
          onCloseClick={() => {
            setIsOpen(false);
          }}
        >
          <React.Fragment>
            <h3>{camera.cameraName}</h3>
            <p>Vehicle Count: {camera.vehicleCount}</p>
            {camera.peakedness != null && (
              <p>
                Peakedness:{` ${(camera.peakedness * 100).toFixed(1)}%`}
              </p>
            )}
          </React.Fragment>
        </InfoWindowF>
      )}
      ;
    </MarkerF>
  )}

  const plotIncidentMarkers = (incident: Report, ind: number) => {
    const index = `incident${ind}`
    
    if(incident.incident === IncidentType.roadClosure && showRoadClosures == false){
      return null;
    }

    if(incident.incident === IncidentType.roadWork && showRoadWorks == false){
      return null;
    }

    if(incident.incident === IncidentType.accident && showAccidents == false){
      return null;
    }

    const infoData: InfoData = {
      location: {
        lng: incident.location.long,
        lat: incident.location.lat
      }
    }

    return (
    <MarkerF
      key={index}
      position={{ lat: incident.location.lat, lng: incident.location.long }}
      onClick={() => handleMarkerClick(index, infoData)}
      icon={incidentIcon(incident.incident)}
    >
      {isOpen && infoWindowData?.id === index && (
        <InfoWindowF
          onCloseClick={() => {
            setIsOpen(false);
          }}
        >
          <React.Fragment>
            <h3>{incident.incident}</h3>
            <p>{incident.description}</p>
            <p>{incident.address}</p>
          </React.Fragment>
        </InfoWindowF>
      )}
      ;
    </MarkerF>
  )
}

  return (
    <div className="map">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={zoomLevel}
          onLoad={onMapLoad}
        >
          {showCameras && cameras.map(plotCameraMarkers)}
          {incidents && incidents.map(plotIncidentMarkers)}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
