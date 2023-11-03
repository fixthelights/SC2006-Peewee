import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppFrame from "../components/AppFrame";
import {
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Stack,
  Card,
} from "@mui/material";
import MapComponent from "../components/Map";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Autocomplete, Libraries, useLoadScript } from "@react-google-maps/api";

// Move array outside of functional component
// See https://github.com/JustFly1984/react-google-maps-api/issues/238
const libraries: Libraries = ["places"];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Map() {
  const navigate = useNavigate();

  const userId = identifyUser();

  function identifyUser() {
    let userJwt = JSON.parse(localStorage.getItem("token") || "null");
    if (userJwt != null) {
      const userDetails: User = jwtDecode(userJwt);
      return userDetails.userId;
    } else {
      return "";
    }
  }

  interface User {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  }

  interface CameraFromAPI {
    camera_name: string;
    location: {
      long: number;
      lat: number;
    };
    vehicle_count: number;
    peakedness: number | null;
  }

  interface Camera {
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

  const [routeData, setRouteData] = React.useState<RouteData | null>(null);
  const [trafficFilters, setTrafficFilters] = React.useState(["show-all"]);
  const [incidentFilters, setIncidentFilters] = React.useState([
    "accident",
    "roadWork",
    "roadClosure",
  ]);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);
  const [incidents, setIncidents] = React.useState<Array<Report>>([]);

  const [directionsRenderer, setDirectionsRenderer] =
    React.useState<google.maps.DirectionsRenderer | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    React.useState<google.maps.DirectionsResult | null>(null);
  const originRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);

  const routePolyline: React.MutableRefObject<any> = React.useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDm-rTxw55HDBTGxVL5kbYVtQjqHVIiPCE",
    libraries: libraries, // Move array outside of functional component
  });

  const placesService = isLoaded
    ? new google.maps.places.PlacesService(document.createElement("div"))
    : null;
  const [clickSaved, setClickSaved] = useState(false);
  const [routeSaved, setRouteSaved] = useState(false);

  const handleTrafficFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes("hide-all")) newFilters = [];

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
    loadTrafficIncidents();
    loadTrafficConditions();
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

      let cameraArray: Array<Camera> = [];

      allCameras.forEach(
        ({
          camera_name,
          location,
          vehicle_count,
          peakedness,
        }: CameraFromAPI) => {
          cameraArray.push({
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
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("sm"));

  async function findPlaceDetails(
    query: string | undefined
  ): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      if (!placesService) {
        reject(new Error("PlacesService is not available"));
      }
      if (query != undefined) {
        const request: google.maps.places.FindPlaceFromQueryRequest = {
          query,
          fields: ["name", "geometry", "place_id"],
        };

        placesService!.findPlaceFromQuery(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            console.error(
              `Find place from query request failed with status: ${status}`
            );
            reject(
              new Error(
                `Find place from query request failed with status: ${status}`
              )
            );
          }
        });
      }
    });
  }

  async function calculateRoute() {
    if (
      originRef.current?.value === "" ||
      destinationRef.current?.value === ""
    ) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current!.value,
      destination: destinationRef.current!.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);

  const originQuery = originRef.current?.value;
  const destinationQuery = destinationRef.current?.value;

    const [originResults, destinationResults] = await Promise.all([
      findPlaceDetails(originQuery),
      findPlaceDetails(destinationQuery),
    ]);

    const originLocation = extractCoordinates(originResults);
    const destinationLocation = extractCoordinates(destinationResults);

    const newRouteData: RouteData = {
      favourited_by: userId,
      source: {
        longitude: originLocation?.lng,
        latitude: originLocation?.lat,
        address: originRef.current!.value,
      },
      destination: {
        longitude: destinationLocation?.lng,
        latitude: destinationLocation?.lat,
        address: destinationRef.current!.value,
      },
    };

    setRouteData(newRouteData);
  }

  function extractCoordinates(
    results: google.maps.places.PlaceResult[]
  ): google.maps.LatLngLiteral | null {
    if (results.length > 0) {
      const location = results[0]?.geometry?.location;
      if (location) {
        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
    }
    return null;
  }

/*function clearRender(){
  if (directionsRenderer) {
  directionsRenderer.setMap(null);
  setDirectionsRenderer(null);
}}*/

function clearRoute(){
  directionsRenderer?.setMap(null)
  setDirectionsResponse(null)
}

  async function saveRoute() {
    setClickSaved(true);

    if (!routeData) {
      setRouteSaved(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2000/routes",
        routeData
      );
      setRouteSaved(true);
    } catch (error) {
      console.error("Error saving route:", error);
      setRouteSaved(false);
    }
  }

  const SaveRouteMessage = () => {
    if (clickSaved) {
      if (routeSaved) {
        return <Alert severity="info">Route successfully saved.</Alert>;
      } else {
        return <Alert severity="info">Route failed to save.</Alert>;
      }
    }
    return null;
  };

  //for dev
  /*function clearRoute() {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
  }

  function clearRoute() {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
    originRef.current!.value = "";
    destinationRef.current!.value = "";
  }*/

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Map" maxWidth={false} disableGutters sx={{}}>
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
            showCameras={trafficFilters.includes("show-all")}
            showAccidents={incidentFilters.includes("accident")}
            showRoadClosures={incidentFilters.includes("roadClosure")}
            showRoadWorks={incidentFilters.includes("roadWork")}
          >
            <Card sx={{m:"20px"}}>
              <Container sx={{ my: 3 }} maxWidth={false}>
                <Typography fontWeight="Bold" sx={{ my: 2 }}>
                  Traffic Camera Filters
                </Typography>
                <ToggleButtonGroup
                  value={trafficFilters}
                  onChange={handleTrafficFilters}
                  size={isScreenSmall ? "small" : "medium"}
                  color="primary"
                >
                  <ToggleButton value="show-all">Show all</ToggleButton>
                  <ToggleButton value="hide-all">Hide all</ToggleButton>
                </ToggleButtonGroup>
              </Container>
              <Container sx={{ my: 3 }} maxWidth={false}>
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
              <Container sx={{ my: 3 }} maxWidth={false}>
                <Typography fontWeight="Bold" sx={{ my: 2 }}>
                  Search Route
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ "& > :not(style)": { width: "35ch" }, my: 2 }}
                >
                  {isLoaded && (
                    <Autocomplete
                      options={{ componentRestrictions: { country: "SG" } }}
                    >
                      <TextField
                        label="Source"
                        variant="outlined"
                        inputRef={originRef}
                      />
                    </Autocomplete>
                  )}
                  {isLoaded && (
                    <Autocomplete
                      options={{ componentRestrictions: { country: "SG" } }}
                    >
                      <TextField
                        label="Destination"
                        variant="outlined"
                        inputRef={destinationRef}
                      />
                    </Autocomplete>
                  )}
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearRoute();
                      calculateRoute();
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => routeData && saveRoute()}
                  >
                    Save Route
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/favouriteroutes")}
                  >
                    View Favourites
                  </Button>
                  {/* For dev purposes
            <Button variant="contained"onClick={clearRoute}>Clear Route</Button>*/}
                </Stack>
                <Box sx={{ pt: 3 }}>
                  <SaveRouteMessage />
                </Box>
              </Container>
            </Card>
          </MapComponent>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}
