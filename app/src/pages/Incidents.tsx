import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react'
import axios from 'axios'
import {IncidentListItem} from '../components/IncidentListItem';
import Alert from '@mui/material/Alert';
import AppFrame from '../components/AppFrame'
import { useNavigate } from "react-router-dom";

interface Report {
  incident: String,
  location: {
    long: Number
    lat: Number
  },
  address: String
  description: String
  time: String
  timestamp: Date
  reported_by: String
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Incidents() {

  const navigate = useNavigate();
  const [reportList, setReportList] = useState([])
  const [isReportLoaded, setIsReportLoaded] = useState(false)

  const getReportList = () => {
    axios.get('http://localhost:2000/reports/today/all')
    .then((res)=> setReportList(res.data))
    .then ((res)=> setIsReportLoaded(true))
    .catch(function(error) {
            console.log(error)
            setIsReportLoaded(false)
        });
  };

  useEffect(() => {
    getReportList();
  }, []);

  const DisplayMessage = () => {
    if (isReportLoaded && reportList.length===0){
      return <DisplayNoIncidentMessage/>
    }
    if (!isReportLoaded){
      return <DisplayErrorMessage />
    }
    return null;
  }
  
  const DisplayNoIncidentMessage = () => {
    return <Alert severity="info">There are no incidents reported today.</Alert>
  }

  const DisplayErrorMessage = () => {
    return <Alert severity="info">There are no incidents reported today.</Alert>
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Incidents">
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
              <Button 
                  variant="contained" 
                  onClick={() => navigate("/reportincident")}
                >
                  Report Incident
              </Button> 
              </Grid>
              {reportList.map((report: Report) => (
              <IncidentListItem 
                incidentType={report.incident.toUpperCase()}
                incidentTime={report.time}
                incidentLocation={report.address}
                incidentDescription={report.description}
                />
                ))}
                <Grid item sx={{pt:2}}>
                  <DisplayMessage/>
                </Grid>
            </Grid>
          </Container>
      </AppFrame>
    </ThemeProvider>
  );
}