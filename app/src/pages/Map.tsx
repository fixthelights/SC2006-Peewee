import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Deposits } from "../components/Deposits";

import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  DashboardIcon,
  CarCrashOutlinedIcon,
  MapOutlinedIcon,
  TrafficOutlinedIcon,
  LogoutOutlinedIcon,
} from "../components/ListButtonIndex";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AppFrame from "../components/AppFrame";
import {
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import MapComponent from "../components/Map";
import axios from "axios";
import { Autocomplete,useLoadScript } from "@react-google-maps/api";


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Map() {

  const [trafficFilters, setTrafficFilters] = React.useState([""]);
  const [incidentFilters, setIncidentFilters] = React.useState([""]);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);
  const [routeData, setRouteData] = React.useState<RouteData | null>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCn6_wKG_mP0YI_eVctQ5zB50VuwMmzoWQ',
    libraries: ['places']
  });

  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer | null>(null);
  const [directionsResponse, setDirectionsResponse] = React.useState<google.maps.DirectionsResult | null>(null);
  const originRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);
  const placesService = isLoaded ? new google.maps.places.PlacesService(document.createElement("div")) : null;
 
  




  const handleTrafficFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes("show-all"))
      newFilters = ["accidents", "city-cams", "highway-cams"];
    if (newFilters.includes("hide-all")) newFilters = [];

    setTrafficFilters(newFilters);
  };

  const handleIncidentFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes("show-all"))
      newFilters = ["accidents", "roadworks", "closures"];
    if (newFilters.includes("hide-all")) newFilters = [];

    setIncidentFilters(newFilters);
  };

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
    source: {
      longitude: number;
      latitude: number;
      address: string;
    };
    destination: {
      longitude: number;
      latitude: number;
      address: string;
    };
  }

  React.useEffect(() => {
    const getData = async () => {
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

    getData();

    return () => {};
  });

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("sm"));

  async function findPlaceDetails(query: string): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      if (!placesService) {
        reject(new Error('PlacesService is not available'));
      }
  
      const request: google.maps.places.FindPlaceFromQueryRequest = {
        query,
        fields: ['name', 'geometry', 'place_id']
      };
  
      placesService!.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          console.error(`Find place from query request failed with status: ${status}`);
          reject(new Error(`Find place from query request failed with status: ${status}`));
        }
      });
    });
  }
  
  function extractCoordinates(results: google.maps.places.PlaceResult[]): google.maps.LatLngLiteral | null {
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

  async function calculateRoute() {
    try {
      if (!originRef.current || !destinationRef.current) {
        return;
      }
  
      const originQuery = originRef.current.value;
      const destinationQuery = destinationRef.current.value;
  
      if (!originQuery || !destinationQuery) {
        return;
      }
  
      clearRender();
  
      const [originResults, destinationResults] = await Promise.all([
        findPlaceDetails(originQuery),
        findPlaceDetails(destinationQuery),
      ]);
  
      const originLocation = extractCoordinates(originResults);
      const destinationLocation = extractCoordinates(destinationResults);
  
      console.log("Origin Location:", originLocation, originRef.current!.value);
      console.log("Destination Location:", destinationLocation, destinationRef.current!.value);
  
      if (!originLocation || !destinationLocation) {
        console.error('Failed to get details for origin or destination');
        return;
      }
  
      const directionsService = new google.maps.DirectionsService();
  
      const results = await directionsService.route({
        origin: originLocation,
        destination: destinationLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      });
  
      setDirectionsResponse(results);
      const newRouteData: RouteData = {
        source: {
          longitude: originLocation.lng,
          latitude: originLocation.lat,
          address: originRef.current!.value,
        },
        destination: {
          longitude: destinationLocation.lng,
          latitude: destinationLocation.lat,
          address: destinationRef.current!.value,
        },
      };
      setRouteData(newRouteData);
    } catch (error) {
      console.error('Error in calculateRoute:', error);
    }
  }

function clearRender(){
  if (directionsRenderer) {
  directionsRenderer.setMap(null);
  setDirectionsRenderer(null);
}}

async function saveRoute(routeData: RouteData) {
  try {
    const response = await axios.post('http://localhost:2000/routes', routeData);
    console.log('Route saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving route:', error);
  }
}

//for dev
/*function clearRoute() {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
    originRef.current!.value = '';
    destinationRef.current!.value = '';
  }*/

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Map">
        <Container sx={{ my: 3 }}>
          <Typography fontWeight="Bold" sx={{ my: 2 }}>
            Traffic Camera Filters
          </Typography>
          <ToggleButtonGroup
            value={trafficFilters}
            onChange={handleTrafficFilters}
            size={isScreenSmall ? "small" : "medium"}
            color="primary"
          >
            <ToggleButton value="accidents">Accident Zone</ToggleButton>
            <ToggleButton value="city-cams">City Cameras</ToggleButton>
            <ToggleButton value="highway-cams">Highway Cameras</ToggleButton>
            <ToggleButton value="show-all">Show all</ToggleButton>
            <ToggleButton value="hide-all">Hide all</ToggleButton>
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
            <ToggleButton value="accidents">Accidents</ToggleButton>
            <ToggleButton value="roadworks">Roadworks</ToggleButton>
            <ToggleButton value="closures">Closure</ToggleButton>
            <ToggleButton value="show-all">Show all</ToggleButton>
            <ToggleButton value="hide-all">Hide all</ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <Container sx={{ my: 3 }}>
          <Typography fontWeight="Bold" sx={{ my: 2 }}>
            Search Route
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ "& > :not(style)": { width: "35ch" }, my: 2 }}
          >
            {isLoaded && (
              <Autocomplete options={{ componentRestrictions: { country: "SG" } }}>
                <TextField
                  label="Source"
                  variant="outlined"
                  inputRef={originRef}
                />
              </Autocomplete>
            )}
            {isLoaded && (
              <Autocomplete options={{ componentRestrictions: { country: "SG" } }}>
                <TextField
                  label="Destination"
                  variant="outlined"
                  inputRef={destinationRef}
                />
              </Autocomplete>
            )}
          
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={calculateRoute}>Search</Button>
            <Button variant="contained" onClick={() => routeData && saveRoute(routeData)}>Save Route</Button>

            <Button variant="contained">View Favourites</Button>
            {/* For dev purposes
            <Button variant="contained"onClick={clearRoute}>Clear Route</Button>*/}
            
          </Stack>
        </Container>
        <Container>
          <MapComponent
            location={{ lng: 103.7992246, lat: 1.3687004, address: "Singapore" }}
            zoomLevel={12}
            cameras={cameras}
            directionsResponse={directionsResponse}
          />
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}
