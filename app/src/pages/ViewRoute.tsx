import * as React from "react";
import MapComponent from "../components/Map";
import axios from "axios";
import { useLoadScript } from "@react-google-maps/api";
import {FC} from 'react';
import {createTheme, ThemeProvider , CssBaseline, Typography, Button, Container, AppFrame, Stack, ToggleButton, ToggleButtonGroup, useTheme, useMediaQuery} from '../components/ComponentsIndex'

interface User{
  userId: string,
  email: string, 
  iat: number,
  exp: number
}

interface ViewRouteProps{
  source: string,
  destination: string
  setViewMap: React.Dispatch<React.SetStateAction<boolean>>
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const ViewRoute: FC<ViewRouteProps> = ({source, destination, setViewMap}) => {

  interface User{
    userId: string,
    email: string, 
    iat: number,
    exp: number
  }

  interface CameraFromAPI{
    camera_name: string,
    location: {
      long: number,
      lat: number
    },
    vehicle_count: number
    peakedness: number | null
  }

  interface Camera{
    cameraName: string,
    lng: number,
    lat: number,
    vehicleCount: number
    peakedness: number | null
  }

  interface RouteData {
    favourited_by: string,
    source: {
      longitude: number | undefined;
      latitude: number | undefined;
      address: string;
    };
    destination: {
      longitude: number | undefined;
      latitude: number | undefined;
      address: string;
    };
  }

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
    duration_hours: number;
    description: string;
    time: string;
    reported_by: string;
  }

  const [trafficFilters, setTrafficFilters] = React.useState(["camera","heatmap"]);
  const [incidentFilters, setIncidentFilters] = React.useState(["accident", "roadWork", "roadClosure"]);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);
  const [incidents, setIncidents] = React.useState<Array<Report>>([]);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDm-rTxw55HDBTGxVL5kbYVtQjqHVIiPCE',
    libraries: ['places']
  });

  const [directionsRenderer, setDirectionsRenderer] =
    React.useState<google.maps.DirectionsRenderer | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    React.useState<google.maps.DirectionsResult | null>(null);
  const originRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);

  const placesService = isLoaded ? new google.maps.places.PlacesService(document.createElement("div")) : null;
 
  const handleTrafficFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes("off")) newFilters = [];

    setTrafficFilters(newFilters);
  };


  const handleIncidentFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes("show-all"))
      newFilters = ["accident", "roadWork", "roadClosure"];
    if (newFilters.includes("hide-all")) newFilters = [];

    setIncidentFilters(newFilters);
  };

  React.useEffect(() => {
   calculateRoute()
  }, []);

  async function loadTrafficIncidents() {
    try {
      const response = await axios.get(
        "http://localhost:2000/reports/today/all"
      );
      console.log(response.data);
      setIncidents(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadTrafficConditions() {
    try {
      const response = await axios.get(
        "http://localhost:2000/traffic/conditions"
      );
      console.log(response.data);
      const allCameras = response.data.cameras;

      let cameraArray: Array<Camera>= [];

      allCameras.forEach(({ camera_name, location, vehicle_count, peakedness} : CameraFromAPI)=> {
        cameraArray.push({
          cameraName: camera_name,
          lng: location.long,
          lat: location.lat,
          vehicleCount: vehicle_count,
          peakedness: peakedness
        })
      });

      setCameras(cameraArray);
    } catch (error) {
      console.log(error);
    }
  };

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("sm"));

  async function calculateRoute() {

    await loadTrafficConditions()
    await loadTrafficIncidents()

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: source,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <AppFrame pageName="View Route">
            <Container sx={{ my: 3 }}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={calculateRoute}>Zoom in to Route</Button>
                  <Button variant="contained" onClick={()=>setViewMap(false)}>Back to Favourites</Button>
                  {/* For dev purposes
                  <Button variant="contained"onClick={clearRoute}>Clear Route</Button>*/}
                  
                </Stack>
            </Container>
                <Container sx={{ my: 3 }}>
                  <Typography fontWeight="Bold" sx={{ my: 2 }}>
                    Traffic Camera Filters
                  </Typography>
                  <ToggleButtonGroup
                      value={trafficFilters}
                      onChange={handleTrafficFilters}
                      size="small"
                      color="primary"
                    >
                      <ToggleButton value="camera">Camera</ToggleButton>
                      <ToggleButton value="heatmap">Heatmap</ToggleButton>
                      <ToggleButton value="off">Off</ToggleButton>
                    </ToggleButtonGroup>
                </Container>
                <Container sx={{ my: 3 }}>
                  <Typography fontWeight="Bold" sx={{ my: 2 }}>
                    Incidents Filters
                  </Typography>
                  <ToggleButtonGroup
                    value={incidentFilters}
                    onChange={handleIncidentFilters}
                    size={isScreenSmall ? "small" : "medium"}
                    color="primary"
                  >
                    <ToggleButton value="accident">Accidents</ToggleButton>
                    <ToggleButton value="roadWork">Roadworks</ToggleButton>
                    <ToggleButton value="roadClosure">Closure</ToggleButton>
                    <ToggleButton value="show-all">Show all</ToggleButton>
                    <ToggleButton value="hide-all">Hide all</ToggleButton>
                  </ToggleButtonGroup>
                </Container>
              <Container sx={{ height: "90vh" }}>
              <MapComponent
                location={{
                  lng: 103.7992246,
                  lat: 1.3687004,
                  address: "Singapore",
                }}
                zoomLevel={12}
                cameras={cameras}
                incidents={incidents}
                directionsResponse={directionsResponse}
                showHeatmap={trafficFilters.includes("heatmap")}
                showCameras={trafficFilters.includes("camera")}
                showAccidents={incidentFilters.includes("accident")}
                showRoadClosures={incidentFilters.includes("roadClosure")}
                showRoadWorks={incidentFilters.includes("roadWork")}
              />
              </Container>
            </AppFrame>
          </ThemeProvider>
  );
}

export {ViewRoute}