import { useState} from 'react';
import axios from 'axios'
import {MouseEvent} from 'react'
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, InputLabel, MenuItem, FormControl, Select, Button, Stack, Alert, Grid, Paper, Container, AppFrame} from '../components/ComponentsIndex'

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
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
            //setLatitude(1.329250)
            //setLongitude(103.855133)
            setCoordinatesDetected(true)
            setCoordinatesToBeConverted(true)
            setLocationPermission(true)
            return
          })
        }
    } catch (error){
      console.log(error)
    }
    setCoordinatesDetected(false)
    setLocationPermission(false)
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

  const DisplayLocationAccessRequest = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
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
                  <Button 
                      variant="contained" 
                      onClick={() => getUserLocation()}
                  >
                      Detect location
                  </Button>
                </Box>
                </Alert>
              </Grid>
              </Box>
  }

  const DisplayViewLocation = () => {
    return <Box sx={{ pl: 3, pt: 3 }}>
                <Grid item xs={12} md={6} lg={5}>
                <Alert 
                  severity="info"
                >
                  <Typography>
                  Location detected. 
                  </Typography>
                <Box sx={{ pt: 3 }}>
                  <Button 
                      variant="contained" 
                      onClick={() => handleLocationAccess()}
                  >
                      Set location
                  </Button>
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
            <Grid item xs={12} md={6} lg={6}>
            <Alert severity="info">
              <Typography>
                Failed to detect address. Redetect current location?
              </Typography>
              <Box sx={{ pt: 3 }}>
                <Button 
                    variant="contained" 
                    onClick={() => getUserLocation()}
                >
                    Yes
                </Button>
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
    axios.post('http://localhost:2000/reports', {
            incident: incidentType,
            location: {
              lat: latitude,
              long: longitude
            },
            address : incidentLocation,
            description: incidentDescription,
            time: reformatTime(date.toLocaleTimeString()),
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

  function reformatTime(time: string){
    if (time.toLowerCase().includes('pm') || time.toLowerCase().includes('am')){
      let currentHour = 12
      let i=0
      let timeString
      while (isNaN(parseInt(time[i]))){
        i++;
      }
      if (time[i+1]==':'){
        if (time.toLowerCase().includes("pm")){ //1-9pm => 13-21:00
          currentHour += parseInt(time[i])
        }
        else {
          currentHour = parseInt(time[i]) //1-9am => 1-9:00
        }
        } else {
          if (time.substring(i,i+2)==='12'){
            if (time.toLowerCase().includes('am')){ //12am -> 0:00
              currentHour=0 
            } else {
              currentHour=12 //12pm -> 12:00
            } 
          } else if(time.toLowerCase().includes("pm")){
            currentHour += parseInt(time.substring(i,i+2)) //10-11pm -> 22-23:00
          } else {
            currentHour = parseInt(time.substring(i,i+2)) // 10-11am -> 10-11:00
          }
          i++
          }
          if (currentHour.toString().length===1){
            timeString = "0" + currentHour.toString() + time.substring(i+1, time.length-3)
          } else {
            timeString = currentHour.toString() + time.substring(i+1, time.length-3)
          }
          return timeString
    } else {
      return time
    }
    
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
    return <Box sx={{ pl: 3, pt: 3 }}>
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