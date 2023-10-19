import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Deposits} from '../components/Deposits';
import {ListItemButton, ListItemIcon, ListItemText, DashboardIcon, CarCrashOutlinedIcon, MapOutlinedIcon, TrafficOutlinedIcon , LogoutOutlinedIcon} from '../components/ListButtonIndex'
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Link from '@mui/material/Link';
import axios from 'axios'
import {useState, useEffect} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../components/Title';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';


const drawerWidth: number = 240;

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

interface Route {
  source: {
    longitude: Number,
    latitude: Number,
    address: String
  },
  destination: {
    longitude: Number, 
    latitude: Number,
    address: String
  },
  description: String
}

interface Traffic{
    vehicle_avg: number,
    vehicle_total: number,
    time_of_day: string
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {

  const theme = useTheme();

  const [open, setOpen] = useState(true);
  const [routeList, setRouteList] = useState([]);
  const [incidentList, setIncidentList] = useState([]);
  const [trafficData, setTrafficData] = useState([])
  const [isRouteLoaded, setIsRouteLoaded] = useState(false)
  const [isIncidentLoaded, setIsIncidentLoaded] = useState(false)
  const [isTrafficLoaded, setIsTrafficLoaded] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getFavouriteRouteList();
    getRecentIncidentList();
    getTrafficData();
  }, []);

  const getFavouriteRouteList = () => {
    axios.get('http://localhost:2000/routes')
    .then((res)=> setRouteList(res.data))
    .then ((res)=> setIsRouteLoaded(true))
    .catch(function(error) {
            console.log(error)
            setIsRouteLoaded(false)
        });
  };

  const getRecentIncidentList = () => {
    axios.get('http://localhost:2000/reports/today/recent')
    .then((res)=> setIncidentList(res.data))
    .then ((res)=> setIsIncidentLoaded(true))
    .catch(function(error) {
            console.log(error)
            setIsIncidentLoaded(false)
        });
  };

  const getTrafficData = () => {
    axios.get('http://localhost:2000/traffic/combined-trends') 
    .then ((res)=> setTrafficData(res.data.hourly_counts))
    .then ((res)=> setIsTrafficLoaded(true))
    .catch(function(error){
      console.log(error)
      setIsTrafficLoaded(false)
    })
  }

  const TrafficTrend = () => {
    if (isTrafficLoaded){
        let data: Array<{time: string, amount: number}>= []
        trafficData.forEach((traffic: Traffic) => {
          if (parseInt(traffic["time_of_day"])<10){
            data.push(createData("0"+traffic["time_of_day"]+":00", traffic["vehicle_total"]))
          } else {
            data.push(createData(traffic["time_of_day"]+":00", traffic["vehicle_total"]))
          }
        })
        return <React.Fragment>
                <Title>Past Traffic Trend</Title>
                <ResponsiveContainer>
                  <LineChart
                    data={data}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                      tickCount={5}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      style={theme.typography.body2}
                    >
                      <Label
                        angle={270}
                        position="left"
                        style={{
                          textAnchor: 'middle',
                          fill: theme.palette.text.primary,
                          ...theme.typography.body1,
                        }}
                      >
                        Total cars 
                      </Label>
                    </YAxis>
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.palette.primary.main}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </React.Fragment>
    }else{
      return <Title>Error in loading. Please refresh the page.</Title>
    }
  }

  const IncidentList = () => {
    if (isIncidentLoaded){
      return    <React.Fragment>
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
                          <TableCell width="20%">{report.incident.toUpperCase()}</TableCell>
                          <TableCell width="10%">{report.time}</TableCell>
                          <TableCell width="70%">{report.address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Link color="primary" href="#" onClick={() => navigate("/incidents")} sx={{ mt: 3 } }>
                    See all incidents
                  </Link>
                  </React.Fragment>
    } else {
      return <Title>Error in loading. Please refresh the page.</Title>
    }
  }

  const FavouriteRouteList = () => {
    if (isRouteLoaded){
      return  <React.Fragment>
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
                      <TableCell>jurong</TableCell> 
                      <TableCell>changi</TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Link color="primary" href="#" sx={{ mt: 3 }}>
                See all routes
              </Link>
              </React.Fragment>
    } else {
      return <Title>Error in loading. Please refresh the page.</Title>
    }
  }

  function createData(time: string, amount: number) {
    return { time, amount };
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
            <MenuIcon />
            </IconButton>
            <MapOutlinedIcon />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              PEEWEE
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <AccountCircleOutlinedIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/incidents")}>
                <ListItemIcon>
                  <CarCrashOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Incidents" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                 <MapOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Map" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <TrafficOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Road Conditions" />
              </ListItemButton>
                <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <LogoutOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out"/>
              </ListItemButton>
            </React.Fragment>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 360,
                  }}
                >
                <TrafficTrend />
                </Paper>
                    </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 360,
                  }}
                >
                  <Deposits title="Maps" />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 320,
                    overflow: 'auto'
                  }}
                >
                <IncidentList />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 320,
                    overflow: 'auto'
                  }}
                >
                <FavouriteRouteList />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}