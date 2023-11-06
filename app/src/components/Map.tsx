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

import "./map.css";
import { Stack, Button, Card, Link, Typography, Box } from "@mui/material";
import { useGoogleMap } from "@react-google-maps/api";
import { createPortal } from "react-dom";

import HeatmapDrawer from "./HeatmapDrawer";

import { latLngToCell } from "h3-js";
import { useNavigate } from "react-router-dom";

enum IncidentType {
  accident = "Accident",
  roadWork = "RoadWork",
  roadClosure = "RoadClosure",
}

interface Report {
  incident: IncidentType;
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
  cameraId: string;
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

  showHeatmap?: boolean;
  showCameras?: boolean;
  showAccidents?: boolean;
  showRoadWorks?: boolean;
  showRoadClosures?: boolean;

  children?: React.ReactNode;
}

interface HexIndexPeak {
  hexIndex: string;
  avgPeakedness: number;
}

interface HexagonList {
  [hexIndex: string]: number[];
}

interface InfoData {
  location: {
    lat: number;
    lng: number;
  };
}

// Move array outside of functional component
// See https://github.com/JustFly1984/react-google-maps-api/issues/238
const libraries: Libraries = ["places"];

const Map: FC<MapProps> = ({
  location,
  zoomLevel = 12,
  cameras,
  incidents,
  directionsResponse,
  showHeatmap = false,
  showCameras = true,
  showAccidents = false,
  showRoadWorks = false,
  showRoadClosures = false,
  children,
}) => {
  const [hexagons, setHexagons] = React.useState<Array<HexIndexPeak>>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<{
    id: string;
    data: InfoData;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [showCameras, showAccidents, showRoadWorks, showRoadClosures]);

  useEffect(() => {
    hexagonGenerator();
  }, [cameras]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDm-rTxw55HDBTGxVL5kbYVtQjqHVIiPCE",
    libraries: libraries,
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

  const plotCameraMarkers = (camera: Camera, ind: number) => {
    const index = `cam${ind}`;

    const infoData: InfoData = {
      location: {
        lng: camera.lng,
        lat: camera.lat,
      },
    };
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
              <Card sx={{ maxWidth: "300px" }}>
                <Typography variant="h3" mb={1} fontSize={18} fontWeight="bold">
                  Camera {camera.cameraName}
                </Typography>
                <Typography display="inline">Vehicle count </Typography>
                <Typography display="inline" fontWeight="bold">
                  {camera.vehicleCount}
                </Typography>
                {camera.peakedness != null && (
                  <Box>
                    <Typography display="inline">Peakedness </Typography>
                    <Typography display="inline" fontWeight="bold">
                      {` ${(camera.peakedness * 100).toFixed(1)}%`}
                    </Typography>
                  </Box>
                )}
                <Stack my={1}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/roadconditions/${camera.cameraId}`)
                    }
                  >
                    <Typography fontSize={10}> View Camera</Typography>
                  </Button>
                </Stack>
              </Card>
            </React.Fragment>
          </InfoWindowF>
        )}
        ;
      </MarkerF>
    );
  };

  const plotIncidentMarkers = (incident: Report, ind: number) => {
    const index = `incident${ind}`;
    if (
      incident.incident === IncidentType.roadClosure &&
      showRoadClosures == false
    ) {
      return null;
    }
    if (incident.incident === IncidentType.roadWork && showRoadWorks == false) {
      return null;
    }
    if (incident.incident === IncidentType.accident && showAccidents == false) {
      return null;
    }

    const infoData: InfoData = {
      location: {
        lng: incident.location.long,
        lat: incident.location.lat,
      },
    };

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
              <Card sx={{ maxWidth: "300px", p: "5px" }}>
                <Typography variant="h3" fontSize={18} fontWeight="bold">
                  {incident.incident}
                </Typography>
                <Typography my={1}>{incident.description}</Typography>
                <Typography fontSize={10}>{incident.address}</Typography>
              </Card>
            </React.Fragment>
          </InfoWindowF>
        )}
        ;
      </MarkerF>
    );
  };

  const hexagonGenerator = () => {
    const hexagons: HexagonList = {};
    cameras.map((camera) => {
      if (!camera.peakedness) {
        return;
      }

      const lat = camera.lat;
      const lng = camera.lng;
      const hexIndex = latLngToCell(lat, lng, 7);

      if (Object.hasOwn(hexagons, hexIndex)) {
        hexagons[hexIndex].push(camera.peakedness);
      } else {
        hexagons[hexIndex] = [camera.peakedness];
      }
    });

    const peakHexList: HexIndexPeak[] = [];
    for (let hexIndex in hexagons) {
      const peakList = hexagons[hexIndex];
      let avgPeak = 0;
      for (let peak of peakList) {
        avgPeak += peak;
      }
      avgPeak = avgPeak / peakList.length;
      peakHexList.push({ hexIndex: hexIndex, avgPeakedness: avgPeak });
    }
    setHexagons(peakHexList);
  };

  // https://developers.google.com/maps/documentation/javascript/controls
  const mapOptions = {
    mapTypeControl: false,
    mapId: "871aac80ceb2f843",
  };

  //TODO
  /*
    - Get bounds zoom level (https://itecnote.com/tecnote/google-maps-to-show-a-country-map-using-google-maps-api/)
    - Nicer Icons for incidents
  */

  return (
    <>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={zoomLevel}
          onLoad={onMapLoad}
          options={mapOptions}
        >
          {showCameras && cameras.map(plotCameraMarkers)}
          {incidents && incidents.map(plotIncidentMarkers)}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {showHeatmap && <HeatmapDrawer peakMap={hexagons} />}
          {children && (
            <CustomControl position={google.maps.ControlPosition.TOP_CENTER}>
              {children}
            </CustomControl>
          )}
        </GoogleMap>
      )}
    </>
  );
};

/* Helper Functions */

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

/* End of Helper Functions */

interface CustomControlProps {
  children?: React.ReactNode;
  position?: google.maps.ControlPosition;
  zIndex?: number;
}

/* 
  Modified Heavily from:
  https://github.com/tomchentw/react-google-maps/issues/818
  https://gist.github.com/jgimbel/6a36d60e28aaf453d0093ddc47f36533
  https://github.com/JustFly1984/react-google-maps-api/blob/master/packages/react-google-maps-api/src/map-context.ts
  https://developers.google.com/maps/documentation/javascript/controls#CustomDrawing

  Finally:
  https://github.com/JustFly1984/react-google-maps-api/issues/213#issuecomment-603800374
  
  Help me it's 7am I haven't slept - Guang
*/

function CustomControl({
  position = google.maps.ControlPosition.TOP_LEFT,
  children,
}: CustomControlProps) {
  const map = useGoogleMap();
  const [container] = useState(document.createElement("div"));

  useEffect(() => {
    if (!map) {
      console.log("Waiting for map to refresh controls");
      return;
    }

    const controls = map.controls[position];
    controls.push(container);
    return () => {
      controls.clear();
    };
  }, [map]);

  return createPortal(children, container);
}

export default Map;
