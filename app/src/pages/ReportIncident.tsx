import React, { FC } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {ListItemButton, ListItemIcon, ListItemText, DashboardIcon, CarCrashOutlinedIcon, MapOutlinedIcon, TrafficOutlinedIcon , LogoutOutlinedIcon} from '../components/ListButtonIndex'
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { ReportController } from "../classes/ReportController";

const drawerWidth: number = 240;

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ReportIncident() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();
  const reportController = new ReportController();

  const [incidentType, setIncidentType] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('')
  const [locationPermission, setLocationPermission] = useState(false);
  const [validLocation, setValidLocation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [validSubmission, setValidSubmission] = useState(false);

  const LocationMessage = () => {
    if (!submissionStatus){
      if (!locationPermission){
        return <Alert 
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
      } else if (validLocation){
        return <Box sx={{ pl: 3, pt: 3 }}>
              <Typography
                component="h1"
                variant="body1"
              >
              Incident Location:
              {incidentLocation}
              </Typography>
              </Box>
      } else {
        return <Alert 
                  severity="info"
                >
                  Location is invalid. Redetect current location?
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
    setLocationPermission(true);
    let location = reportController.getUserLocation();
    if (location != ''){
      setIncidentLocation(location);
      setValidLocation(true);
    } else {
      setValidLocation(false);
    }
  }

  const IncidentTypeSelection = () => {
    if (!submissionStatus){
      if (validLocation){
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
                <MenuItem value={"Accidents"}>Accidents</MenuItem>
                <MenuItem value={"Roadworks"}>Roadworks</MenuItem>
                <MenuItem value={"Closure"}>Closure</MenuItem>
                <MenuItem value={"Slow Traffic"}>Slow Traffic</MenuItem>
                </Select>
                </FormControl>
                </Box>
      } 
    }
    return null;
  }
  

  const IncidentDescriptionInput= () => {
    if (!submissionStatus){
      if (incidentType!= ''){
        return  <Box sx={{ width: 360, pl: 3, pt: 3 }}>
                  <Typography
                  component="h1"
                  variant="body1"
                  >
                  Incident Description:
                  </Typography>
                  <Box>
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

  const SubmitButton = () =>{
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

  const handleSubmission = () =>{
    setSubmissionStatus(true);
    setValidSubmission(reportController.saveReport(incidentLocation,incidentType,incidentDescription));
  }

  const SubmissionMessage = () => {
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
    setValidLocation(false);
    setIncidentType('');
    setIncidentDescription('');
    setSubmissionStatus(false);
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
              Report Incident
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
       <LocationMessage />
       <IncidentTypeSelection />
       <IncidentDescriptionInput />
       <SubmitButton />
       <SubmissionMessage />
      </Box>
      </Box>
    </ThemeProvider>
  );
}