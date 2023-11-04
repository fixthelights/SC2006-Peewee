import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppFrame from "../components/AppFrame";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";

interface Geocode {
  lat: number | null;
  long: number | null;
}

interface CameraData {
  cameraId: string;
  location: {
    lat: number;
    long: number;
  };
  picture?: string;
}

const defaultTheme = createTheme();

export default function RoadConditionsPage() {
  const [locationInput, setLocationInput] = useState<string>("");
  const [geocode, setGeocode] = useState<Geocode>({ lat: null, long: null });
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCameraData = async () => {
    try {
      const response = await axios.get<CameraData>(
        `http://localhost:2000/cameras`
      );
      setCameraData(response.data);
    } catch (error) {
      setError(
        "Error fetching camera data. Please check the location and try again."
      );
    }
  };

  const handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(event.target.value);
  };

  const getGeocode = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${locationInput}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setGeocode({ lat, long: lng });
      } else {
        setError("Location not found. Please enter a valid location.");
      }
    } catch (error) {
      setError("Error fetching geocode. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Road Conditions Page">
        <Container sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search for Camera Location
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="locationInput"
                label="Location Input"
                variant="outlined"
                value={locationInput}
                onChange={handleLocationInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" onClick={getGeocode}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
        {error && (
          <Container sx={{ my: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        )}
        {geocode.lat && geocode.long && (
          <Container sx={{ my: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Camera Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Latitude: {geocode.lat}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Longitude: {geocode.long}
            </Typography>
            <Button variant="contained" onClick={fetchCameraData}>
              Fetch Camera Data
            </Button>
          </Container>
        )}
        {cameraData && (
          <Container sx={{ my: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Camera Data
            </Typography>
            {/* Display the camera data here */}
          </Container>
        )}
      </AppFrame>
    </ThemeProvider>
  );
}