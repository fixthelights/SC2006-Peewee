import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import MapComponent from "../components/Map";
import axios from "axios";
import {
  useTheme,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Typography,
  Button,
  Stack,
  Container,
  AppFrame,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  Card,
} from "../components/ComponentsIndex";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { ExpandMore } from "@mui/icons-material";

interface User {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

interface CameraFromAPI {
  camera_id: string;
  camera_name: string;
  location: {
    long: number;
    lat: number;
  };
  vehicle_count: number;
  peakedness: number | null;
}

interface Camera {
  cameraId: string;
  cameraName: string;
  lng: number;
  lat: number;
  vehicleCount: number;
  peakedness: number | null;
}

interface RouteData {
  favourited_by: string;
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
  incident: IncidentType;
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

// Move array outside of functional component
// See https://github.com/JustFly1984/react-google-maps-api/issues/238
const libraries: Libraries = ["places"];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface ViewRouteProps{
  source: string,
  destination: string
  setViewMap: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewRoute: React.FC<ViewRouteProps> = ({source, destination, setViewMap}) => {

  const [openAccordion, setOpenAccordion] = React.useState(false);
  const [trafficFilters, setTrafficFilters] = React.useState(["camera"]);
  const [incidentFilters, setIncidentFilters] = React.useState([
    "accident",
    "roadWork",
    "roadClosure",
  ]);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);
  const [incidents, setIncidents] = React.useState<Array<Report>>([]);

  const [directionsResponse, setDirectionsResponse] =
    React.useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY || "",
    libraries: libraries, // Move array outside of functional component
  });

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
        `http://${process.env.REACT_APP_SERVER_URL}/reports/today/all`
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
        `http://${process.env.REACT_APP_SERVER_URL}/traffic/conditions`
      );
      console.log(response.data);
      const allCameras = response.data.cameras;

      let cameraArray: Array<Camera> = [];

      allCameras.forEach(
        ({
          camera_id,
          camera_name,
          location,
          vehicle_count,
          peakedness,
        }: CameraFromAPI) => {
          cameraArray.push({
            cameraId: camera_id,
            cameraName: camera_name,
            lng: location.long,
            lat: location.lat,
            vehicleCount: vehicle_count,
            peakedness: peakedness,
          });
        }
      );

      setCameras(cameraArray);
    } catch (error) {
      console.log(error);
    }
  }

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

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
      <AppFrame pageName="View Route" maxWidth={false} disableGutters sx={{}}>
        <Container sx={{ height: "90vh" }} maxWidth={false} disableGutters>
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
          >
            <Card sx={{ m: 1 }}>
              <Accordion
                disableGutters={isScreenSmall}
                expanded={openAccordion}
                onChange={() => setOpenAccordion(!openAccordion)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Container disableGutters>
                    <Typography align="center" fontWeight="bold">
                      Zoom In and Filter
                    </Typography>
                  </Container>
                </AccordionSummary>
                <AccordionDetails sx={isScreenSmall ? { p: 0 } : {}}>
                  <Container sx={{ my: 3 }} maxWidth={false}>
                      <Container sx={{ my: 3 }}>
                        <Stack direction="row" spacing={2}>
                          <Button variant="contained" onClick={calculateRoute}>Zoom in to Route</Button>
                          <Button variant="contained" onClick={()=>setViewMap(false)}>Back to Favourites</Button>
                        </Stack>
                      </Container>
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
                  <Container sx={{ my: 3 }} maxWidth={false}>
                    <Typography fontWeight="Bold" sx={{ my: 2 }}>
                      Incidents Filters
                    </Typography>
                    <ToggleButtonGroup
                      value={incidentFilters}
                      onChange={handleIncidentFilters}
                      size="small"
                      color="primary"
                    >
                      <ToggleButton value="accident">Accidents</ToggleButton>
                      <ToggleButton value="roadWork">Roadworks</ToggleButton>
                      <ToggleButton value="roadClosure">Closure</ToggleButton>
                      {!isScreenSmall && (
                        <ToggleButton value="show-all">Show all</ToggleButton>
                      )}
                      {!isScreenSmall && (
                        <ToggleButton value="hide-all">Hide all</ToggleButton>
                      )}
                    </ToggleButtonGroup>
                  </Container>
                </AccordionDetails>
              </Accordion>
            </Card>
          </MapComponent>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}

export {ViewRoute}