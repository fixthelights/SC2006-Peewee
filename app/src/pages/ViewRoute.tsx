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
} from "@mui/material";
import MapComponent from "../components/Map";
import axios from "axios";
import { Autocomplete,useLoadScript } from "@react-google-maps/api";
import {jwtDecode} from 'jwt-decode';
import {useState, FC} from 'react';
import FavouriteRoutes from '../pages/FavouriteRoutes'
import { useNavigate } from "react-router-dom";



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

  const navigate = useNavigate()

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

  const [trafficFilters, setTrafficFilters] = React.useState([""]);
  const [incidentFilters, setIncidentFilters] = React.useState([""]);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCn6_wKG_mP0YI_eVctQ5zB50VuwMmzoWQ',
    libraries: ['places']
  });

  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer | null>(null);
  const [directionsResponse, setDirectionsResponse] = React.useState<google.maps.DirectionsResult | null>(null);
  const placesService = isLoaded ? new google.maps.places.PlacesService(document.createElement("div")) : null;

  const [backToRoutes, setBackToRoutes] = useState(false)
 
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
      const originQuery = source
      const destinationQuery = destination
  
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
    } catch (error) {
      console.error('Error in calculateRoute:', error);
    }
  }

function clearRender(){
  if (directionsRenderer) {
  directionsRenderer.setMap(null);
  setDirectionsRenderer(null);
}}

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
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={calculateRoute}>View Route</Button>
                  <Button variant="contained" onClick={()=>setViewMap(false)}>Back to Favourites</Button>
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

export {ViewRoute}