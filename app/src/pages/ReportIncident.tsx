import React from 'react';
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
  const [locationDetected, setLocationDetected] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('')
  const [locationPermission, setLocationPermission] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [validSubmission, setValidSubmission] = useState(false);

  useEffect(() => {
    getUserLocation()
  }, []);

  function getUserLocation(): void {
    //let lat = 1000
    //let long = 1000

    //setLatitude(1.3456) //Jurong West Address 
    //setLongitude(103.704116) //Jurong West Address 

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
      })
    } 
  }

  const DisplayLocationMessage = () => {
    if (!submissionStatus && incidentType!=''){
      if (!locationPermission){
        return <Box sx={{ pl: 3, pt: 3 }}>
                <Grid item xs={12} md={6} lg={5}>
                <Alert 
                  severity="info"
                >
                  Grant location access to PEEWEE?
                <Box sx={{ pt: 3 }}>
                <Stack spacing={2} direction="row">
                  <Button 
                      variant="contained" 
                      onClick={()=>handleLocationAccess()}
                  >
                      Yes
                  </Button>
                  <Button 
                      variant="contained" 
                      onClick={() => navigate("/incidents")}
                  >
                      Return to Incidents Page
                  </Button>
                </Stack>
                </Box>
                </Alert>
              </Grid>
              </Box>
      } else if (locationDetected){
        return <Box sx={{ pl: 3, pt: 3 }}>
              <Typography
                component="h1"
                variant="body1"
              >
              Incident Location: {incidentLocation}
              </Typography>
              </Box>
      } else {
        return <Alert 
                  severity="info"
                >
                  Failed to detect location. Redetect current location?
                <Box sx={{ pt: 3 }}>
                <Stack spacing={2} direction="row">
                  <Button 
                      variant="contained" 
                      onClick={handleLocationAccess}
                  >
                      Yes
                  </Button>
                  <Button 
                      variant="contained" 
                      onClick={() => navigate("/incidents")}
                  >
                      Return to Incident Page
                  </Button>
                </Stack>
                </Box>
                </Alert>
      }
    }
    return null;
  }
  

  const handleLocationAccess = () => {

    axios.get(`https://eu1.locationiq.com/v1/reverse?key=pk.565aea3b0b4252d7587da4689cd6869e&lat=${latitude}&lon=${longitude}&format=json`)
    .then((res)=> setIncidentLocation(res.data['display_name']))
    .then ((res)=> setLocationDetected(true))
    .then((res)=> setLocationPermission(true))
    .catch(function(error) {
        console.log(error);
        setLocationDetected(false)
        setLocationPermission(true)
    });
    
  }

  const DisplayIncidentTypeSelection = () => {
    if (!submissionStatus){
        return  <Box sx={{ width: 360, pl: 3, pt: 3 }}>
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
    }
    return null;
  }
  

  const DisplayIncidentDescriptionInput= () => {
    if (!submissionStatus){
      if (locationDetected){
        return  <Box sx={{ width: 360, pl: 3, pt: 3 }}>
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
                  ref={ref => ref && ref.focus()}
                  onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                  onChange={(e) => setIncidentDescription(e.target.value)}>
                  </textarea>
                  </Box>
                </Box>
      }
    }
    return null;
  }

  const DisplaySubmitButton = () =>{
    if (!submissionStatus){
      if (incidentDescription!=''){
        return <Box sx={{ pl: 3, pt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmission} // navigate to submission page 
                >
                Submit
                </Button>
                </Box>
      } 
    }
    return null;
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
            duration_hours: date.getHours()
        })
        .then((res)=> console.log(res.data))
        .then ((res)=> setValidSubmission(true))
        .catch(function(error) {
            console.log(error)
            setValidSubmission(false)
        });
  }

  const DisplaySubmissionMessage = () => {
    if (submissionStatus){
      if (validSubmission){
        return <Alert severity="info"> 
                  Incident is successfully reported. 
                  <Box sx={{ pt: 3 }}>
                  <Button 
                      variant="contained" 
                      onClick={()=>navigate("/incidents")}
                  >
                  Return to Incident Page
                  </Button>
                  </Box>
                </Alert>
      } else{
        return <Alert severity="info"> 
                  Error in report submission
                  <Box sx={{ pt: 3 }}>
                  <Stack spacing={2} direction="row">
                  <Button 
                      variant="contained" 
                      onClick={handleReenter}
                  >
                      Re-enter form details
                  </Button>
                  <Button 
                      variant="contained" 
                      onClick={() => navigate("/incidents")}
                  >
                      Return to Incidents Page
                  </Button>
                  </Stack>
                  </Box>
                </Alert>
      }
    }
    return null;
  }

  const handleReenter = () => {
    setIncidentLocation('');
    setLocationPermission(false);
    setLocationDetected(false);
    setIncidentType('');
    setIncidentDescription('');
    setSubmissionStatus(false);
    setLatitude(1000)
    setLongitude(1000)
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
                        height: 500,
                        overflow: 'auto'
                    }}>
                  <DisplayIncidentTypeSelection />
                  <DisplayLocationMessage />
                  <DisplayIncidentDescriptionInput />
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