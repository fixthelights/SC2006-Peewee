import React, { useCallback } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import axios from 'axios'
import {MouseEvent} from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import AppFrame from '../components/AppFrame'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ReportIncident() {

  const navigate = useNavigate();

  const [incidentType, setIncidentType] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [latitude, setLatitude] = useState(1000)
  const [longitude, setLongitude] = useState(1000)
  const [coordinatesToBeConverted, setCoordinatesToBeConverted] = useState(false)
  const [coordinatesConverted, setCoordinatesConverted] = useState(false);
  const [coordinatesDetected, setCoordinatesDetected] = useState(false)
  const [incidentDescription, setIncidentDescription] = useState('')
  const [locationPermission, setLocationPermission] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [validSubmission, setValidSubmission] = useState(false);

  function getUserLocation(): void {

    try{
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            //setLatitude(position.coords.latitude)
           // setLongitude(position.coords.longitude)
            //1.373210, 103.752203
            // 1.373202747626978, 103.75235792157387
            // 1.323331, 103.746198
            // 1.3247821180436887, 103.74252003735413
            // 1.307851, 103.791531
            setLatitude(1.307851)
            setLongitude(103.791531)
            setCoordinatesDetected(true)
            setCoordinatesToBeConverted(true)
            setLocationPermission(true)
          })
        }
    } catch (error){
      console.log(error)
      setCoordinatesDetected(false)
      setLocationPermission(false)
    }

  }

  const DisplayLocationMessage = () => {
    if (!locationPermission){
        return <DisplayLocationAccessRequest/>
      } else if (coordinatesDetected){
        if (coordinatesToBeConverted) return <DisplayViewLocation />
        else if (!coordinatesConverted) return <DisplayRetry />
        else return <DisplayLocation />
      } else {
        return <DisplayRetry />
      }
  }

  const DisplayViewLocation = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
                <Grid item xs={12} md={6} lg={5}>
                <Alert 
                  severity="info"
                >
                  Location detected. 
                <Box sx={{ pt: 3 }}>
                <Stack spacing={2} direction="row">
                  <Button 
                      variant="contained" 
                      onClick={() => handleLocationAccess()}
                  >
                      Set location
                  </Button>
                </Stack>
                </Box>
                </Alert>
              </Grid>
              </Box>
  }

  const DisplayLocationAccessRequest = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
                <Grid item xs={12} md={6} lg={10}>
                <Alert 
                  severity="info"
                >
                  Location access is needed to set incident location. Ensure that location access has been allowed on your device. 
                <Box sx={{ pt: 3 }}>
                <Stack spacing={2} direction="row">
                  <Button 
                      variant="contained" 
                      onClick={() => getUserLocation()}
                  >
                      Detect location
                  </Button>
                </Stack>
                </Box>
                </Alert>
              </Grid>
              </Box>
  }
  
  const DisplayLocation = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
          <Typography
            component="h1"
            variant="body1"
          >
          Incident Location: {incidentLocation}
          </Typography>
          </Box>
  }

  const DisplayRetry = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
            <Grid item xs={12} md={6} lg={5}>
            <Alert severity="info">
                Failed to detect address. Redetect current location?
              <Box sx={{ pt: 3 }}>
              <Stack spacing={2} direction="row">
                <Button 
                    variant="contained" 
                    onClick={() => getUserLocation()}
                >
                    Yes
                </Button>
              </Stack>
              </Box>
              </Alert>
            </Grid>
          </Box>
  }

  const handleLocationAccess = () => {

    axios.get(`https://eu1.locationiq.com/v1/reverse?key=pk.565aea3b0b4252d7587da4689cd6869e&lat=${latitude}&lon=${longitude}&format=json`)
    .then((res)=> setIncidentLocation(res.data['display_name']))
    .then ((res)=> setCoordinatesConverted(true))
    .then ((res)=> setCoordinatesToBeConverted(false))
    .catch(function(error) {
        console.log(error);
        setCoordinatesConverted(false)
        setCoordinatesToBeConverted(false)
    });
    
  }

  const DisplaySubmitButton = () =>{
    if (!submissionStatus && incidentType!='' && incidentDescription!='' && coordinatesDetected && coordinatesConverted){
        return <Box sx={{ pl: 3, pt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmission} // navigate to submission page 
                >
                Submit
                </Button>
                </Box>
      } 
    return null
}

  const handleSubmission = async(e: MouseEvent<HTMLButtonElement>) =>{
    const date = new Date();
    setSubmissionStatus(true);
    axios.post('http://localhost:2000/reports', {
            incident: incidentType,
            location: {
              lat: latitude,
              long: longitude
            },
            address : incidentLocation,
            description: incidentDescription,
            time: date.toLocaleTimeString(),
            date: date.toDateString()
        })
        .then((res)=> console.log(res.data))
        .then((res)=> setValidSubmission(true))
        .then((res)=>setSubmissionStatus(true))
        .catch(function(error) {
            console.log(error)
            setValidSubmission(false)
            setSubmissionStatus(true)
        });
    
  }

  const DisplaySubmissionMessage = () => {
    if (submissionStatus){
      if (validSubmission){
        return <DisplaySuccessfulSubmission />
      } else{
        return <DisplayErrorMessage />
      }
  }
  return null
}

const DisplaySuccessfulSubmission = () => {
  return <Box sx={{ pl: 3, pt: 3 }}>
          <Grid item xs={12} md={6} lg={7}>
          <Alert severity="info"> 
          Incident is successfully reported. 
         <Box sx={{ pt: 3 }}>
         <Button 
          variant="contained" 
          onClick={handleReenter}
         >
          Submit another form
         </Button>
         </Box>
         </Alert>
         </Grid>
         </Box>
}

const DisplayErrorMessage = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
            <Grid item xs={12} md={6} lg={7}>
            <Alert severity="info"> 
            Error in report submission
            <Box sx={{ pt: 3 }}>
             <Stack spacing={2} direction="row">
             <Button 
              variant="contained" 
              onClick={handleReenter}
             >
             Re-enter form details
            </Button>
            </Stack>
            </Box>
           </Alert>
           </Grid>
           </Box>
  }

  const handleReenter = () => {
    setIncidentLocation('');
    setLocationPermission(false);
    setCoordinatesDetected(false)
    setCoordinatesToBeConverted(false)
    setCoordinatesConverted(false)
    setIncidentType('');
    setIncidentDescription('');
    setValidSubmission(false)
    setSubmissionStatus(false)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppFrame pageName="Report Incidents">
       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={12}>
              <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 770,
                        overflow: 'auto'
                    }}>
                    <Box sx={{ width: 360, pl: 3, pt: 3 }}>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Incident Type</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={incidentType}
                        label="Incident Type"
                        onChange={(e) => setIncidentType(e.target.value)}
                        >
                        <MenuItem value={"Accident"}>Accidents</MenuItem>
                        <MenuItem value={"RoadWork"}>Roadworks</MenuItem>
                        <MenuItem value={"RoadClosure"}>Closure</MenuItem>
                        </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: 360, pl: 3, pt: 3 }}>
                        <Typography
                        component="h1"
                        variant="body1"
                        >
                        Incident Description:
                        </Typography>
                        <Box sx={{pt: 3}}>
                        <textarea 
                        name="Text1" 
                        cols={100} 
                        rows={5}
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}>
                        </textarea>
                    </Box>
                    </Box>
                  <DisplayLocationMessage />
                  <DisplaySubmitButton />
                  <DisplaySubmissionMessage />
              </Paper>
              </Grid>
            </Grid>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}