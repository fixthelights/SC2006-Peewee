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
  duration_hours: Number
  description: String
  time: String
  timestamp: Date
  reported_by: String
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Incidents() {
  let listOfReports: Array<Report> = [];
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

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

  const Message = () => {
    if (isReportLoaded && reportList.length===0){
      return <Alert severity="info">There are no incidents reported today.</Alert>
    }
    if (!isReportLoaded){
      return <Alert severity="info">Error in loading. Please refresh the page again.</Alert>
    }
    return null;
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
                  <Message/>
                </Grid>
            </Grid>
          </Container>
      </AppFrame>
    </ThemeProvider>
  );
}