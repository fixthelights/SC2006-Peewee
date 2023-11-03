import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import axios from "axios";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../components/Title";
import { useTheme } from "@mui/material/styles";
import MapComponent from "../components/Map";
import Stack from "@mui/material/Stack";
import AppFrame from "../components/AppFrame";
import {TrafficChart} from "../components/TrafficChart"
import {jwtDecode} from 'jwt-decode';

const drawerWidth: number = 240;

interface User{
  userId: string,
  email: string, 
  iat: number,
  exp: number
}

interface Report {
  incident: String;
  location: {
    long: Number;
    lat: Number;
  };
  address: String;
  duration_hours: Number;
  description: String;
  time: String;
  timestamp: Date;
  reported_by: String;
}

interface Route {
  source: {
    longitude: Number;
    latitude: Number;
    address: String;
  };
  destination: {
    longitude: Number;
    latitude: Number;
    address: String;
  };
}

interface Traffic {
  vehicle_avg: number;
  vehicle_total: number;
  time_of_day: string;
}

interface CameraFromAPI {
  camera_name: string;
  location: {
    long: number;
    lat: number;
  };
  vehicle_count: number;
  peakedness: number;
}

interface Camera {
  cameraName: string;
  lng: number;
  lat: number;
  vehicleCount: number;
  peakedness: number;
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const theme = useTheme();

  const [open, setOpen] = useState(true);
  const [routeList, setRouteList] = useState([]);
  const [incidentList, setIncidentList] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [currentCarCount, setCurrentCarCount] = useState(0)
  const [timeRetrieved, setTimeRetrieved] = useState("")
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);
  const [isIncidentLoaded, setIsIncidentLoaded] = useState(false);
  const [isTrafficLoaded, setIsTrafficLoaded] = useState(false);
  const [isCurrentTrafficLoaded, setIsCurrentTrafficLoaded] = useState(false);
  const [cameras, setCameras] = React.useState<Array<Camera>>([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const userId = identifyUser()

  useEffect(() => {
    identifyUser();
    getRecentIncidentList();
    getTrafficData();
    getTrafficCameraData();
    getCurrentData()
    getFavouriteRouteList();
  }, []);

  function identifyUser(){
    let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
    if (userJwt!=null){
      const userDetails: User = jwtDecode(userJwt)
      return userDetails.userId
    }
    else{
      return ''
    }
  }
  const getFavouriteRouteList = () => {
     console.log(userId)
      axios
      .post("http://localhost:2000/routes/list",
      {
        id: userId
      })
      .then((res) => setRouteList(res.data))
      .then((res) => setIsRouteLoaded(true))
      .catch(function (error) {
        console.log(error);
        setIsRouteLoaded(false);
      });
  };

  const getRecentIncidentList = () => {
    axios
      .get("http://localhost:2000/reports/today/recent")
      .then((res) => setIncidentList(res.data))
      .then((res) => setIsIncidentLoaded(true))
      .catch(function (error) {
        console.log(error);
        setIsIncidentLoaded(false);
      });
  };

  const getTrafficData = () => {
    axios
      .get("http://localhost:2000/traffic/combined-trends")
      .then((res) => setTrafficData(res.data.hourly_counts))
      .then((res) => setIsTrafficLoaded(true))
      .catch(function (error) {
        console.log(error);
        setIsTrafficLoaded(false);
      });
  };

  const getTrafficCameraData = async () => {
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

  const getCurrentData = () => {
    axios
      .get("http://localhost:2000/traffic/combined-conditions")
      .then((res) => {setCurrentCarCount(res.data['vehicle_total']); setTimeRetrieved(res.data['taken_at']);})
      .then((res) => setIsCurrentTrafficLoaded(true))
      .catch(function (error) {
        console.log(error);
        setIsCurrentTrafficLoaded(false);
      });
  };

  const TrafficTrend = () => {
    if (isTrafficLoaded && isCurrentTrafficLoaded) {
      console.log(timeRetrieved);
      let time = timeRetrieved.split(",")[1]
      let currentHour = 12
      let i=0
      while (isNaN(parseInt(time[i]))){
        i++;
      }
      if (time[i+1]==':'){
          if (time.toLowerCase().includes("pm")){
            currentHour += parseInt(time[i])
          }
          else {
            currentHour = parseInt(time[i])
          }
      } else {
        if (time.toLowerCase().includes("pm")){
          currentHour += parseInt(time.substring(i,i+2))
        }
        else {
          currentHour = parseInt(time.substring(i,i+2))
        }
      }

      let data: Array<{ time: string; trend: number | null; current: number | null }> = [];
      let average = 0;
      trafficData.forEach((traffic: Traffic) => {
        if (parseInt(traffic["time_of_day"]) < 10) {
          if (currentHour == parseInt(traffic["time_of_day"])){
            data.push(
              createData(
                "0" + traffic["time_of_day"] + ":00",
                traffic["vehicle_total"], currentCarCount
              )
            );
          } else {
            data.push(
              createData(
                "0" + traffic["time_of_day"] + ":00",
                traffic["vehicle_total"], null
              )
            );
          }
        } else {
          if (currentHour == parseInt(traffic["time_of_day"])){
            data.push(
              createData(
                traffic["time_of_day"] + ":00",
                traffic["vehicle_total"], currentCarCount
              )
            );
          } else {
            data.push(
              createData(
                traffic["time_of_day"] + ":00",
                traffic["vehicle_total"], null
              )
            );
          }
        }
        average += traffic["vehicle_total"];
      });
      average /= 24;
      
      return (
        <React.Fragment>
          <TrafficChart carsNow={currentCarCount} average={average} data={data}/>
          <Link color="primary" href="#" sx={{ mt: 3 }}>
            See specific camera trends
          </Link>
        </React.Fragment>
      );
    } else {
      return <Title>Error in loading. Please refresh the page.</Title>;
    }
  };

  const IncidentList = () => {
    if (isIncidentLoaded && incidentList.length>0) {
      return (
        <React.Fragment>
          <Title>Recent Incidents</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Incident</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidentList.map((report: Report) => (
                <TableRow>
                  <TableCell width="20%">
                    {report.incident.toUpperCase()}
                  </TableCell>
                  <TableCell width="18%">{report.time}</TableCell>
                  <TableCell width="62%">{report.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link
            color="primary"
            href="#"
            onClick={() => navigate("/incidents")}
            sx={{ mt: 3 }}
          >
            See all incidents
          </Link>
        </React.Fragment>
      );
    }
    if (isIncidentLoaded && incidentList.length == 0) {
      return <Title>There are no incidents reported today</Title>;
    }
    if (!isIncidentLoaded) {
      return <Title>Error in loading. Please refresh the page.</Title>;
    }
    return null;
  };

  const FavouriteRouteList = () => {
    if (isRouteLoaded && routeList.length>0) {
      return (
        <React.Fragment>
          <Title>Favorite routes</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeList.map((route: Route) => (
                <TableRow>
                  <TableCell>{route.source.address}</TableCell>
                  <TableCell>{route.destination.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link color="primary" href="#" onClick={()=>navigate('/favouriteroutes')} sx={{ mt: 3 }}>
            See all routes
          </Link>
        </React.Fragment>
      );
    }
    if (isRouteLoaded && routeList.length === 0) {
      return <Title>There are no favourite routes saved.</Title>;
    }
    if (!isRouteLoaded) {
      return <Title>Error in loading. Please refresh the page.</Title>;
    }
    return null;
  };

  function createData(time: string, trend: number | null, current: number | null ) {
    return { time, trend, current };
  }

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
          <AppFrame pageName="Dashboard">
          <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 450,
                  }}
                >
                  <TrafficTrend />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 450,
                    overflow: "auto",
                  }}
                >
                  <Stack spacing={20} direction="row">
                    <Title>Current Traffic Conditions</Title>
                    <Link
                      color="primary"
                      href="#"
                      onClick={() => navigate("/map")}
                      sx={{ mt: 3 }}
                    >
                      Go to map page
                    </Link>
                  </Stack>
                  <MapComponent
                    location={{
                      lng: 103.7992246,
                      lat: 1.3687004,
                      address: "Singapore",
                    }}
                    zoomLevel={12}
                    cameras={cameras}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 320,
                    overflow: "auto",
                  }}
                >
                  <IncidentList />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 320,
                    overflow: "auto",
                  }}
                >
                  <FavouriteRouteList />
                </Paper>
              </Grid>
            </Grid>
          </AppFrame>
    </ThemeProvider>
  );
}
