import { useState} from 'react';
import axios from 'axios'
import {MouseEvent} from 'react'
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, InputLabel, MenuItem, FormControl, Select, Button, Stack, Alert, Grid, Paper, Container, AppFrame, TextField} from '../components/ComponentsIndex'

//import * as Location from 'expo-location';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ReportIncident() {

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
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
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
    return <Box>
                <Grid item xs={12} md={6} lg={5}>
                <Alert 
                  severity="info"
                >
                  <Typography>
                  Location detected. 
                  </Typography>
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
    return <Box>
                <Grid item xs={12} md={6} lg={6}>
                <Alert 
                  severity="info"
                >
                  <Typography>
                  Location access is needed to set incident location. 
                  </Typography>
                  <Typography>
                  Ensure that location access has been allowed on your device. 
                  </Typography>
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
    return <Box>
          <Typography
            component="h1"
            variant="body1"
          >
          Incident Location: {incidentLocation}
          </Typography>
          </Box>
  }

  const DisplayRetry = () => {
    return <Box>
            <Grid item xs={12} md={6} lg={6}>
            <Alert severity="info">
              <Typography>
                Failed to detect address. Redetect current location?
              </Typography>
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
        return <Box>
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
    axios.post(`http://${process.env.REACT_APP_SERVER_URL}/reports`, {
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
  return <Box>
          <Grid item xs={12} md={6} lg={7}>
          <Alert severity="info"> 
          <Typography>
          Incident is successfully reported. 
          </Typography>
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
    return <Box>
            <Grid item xs={12} md={6} lg={7}>
            <Alert severity="info"> 
            <Typography>
            Error in report submission
            </Typography>
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
       <Paper>
            <Grid container spacing={2} direction="column" padding={{xs:2,md:4}}>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={12}>
                    <Box sx={{ maxWidth: 360}}>
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
                  </Grid>
                  <Grid item xs={12} md={6} lg={12}>
                    <Box>
                        <Typography
                        component="h1"
                        variant="body1"
                        paddingBottom={1}
                        >
                        Incident Description:
                        </Typography>
                        <Box>
                        <TextField 
                        fullWidth={true}
                        multiline
                        rows={10}
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}>
                        </TextField>
                    </Box>
                    </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={12}>
                  <DisplayLocationMessage />
                  </Grid>
                  <Grid item xs={12} md={6} lg={12}>
                  <DisplaySubmitButton />
                  </Grid>
                  <Grid item xs={12} md={6} lg={12}>
                  <DisplaySubmissionMessage />
                  </Grid>
             
              
            </Grid>
            </Paper>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}