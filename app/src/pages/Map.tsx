import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Deposits } from "../components/Deposits";
import Orders from "../components/Orders";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  DashboardIcon,
  CarCrashOutlinedIcon,
  MapOutlinedIcon,
  TrafficOutlinedIcon,
  LogoutOutlinedIcon,
} from "../components/ListButtonIndex";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Chart from "../components/Chart";
import AppFrame from "../components/AppFrame";
import {
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Stack
} from "@mui/material";
import MapComponent from "../components/Map";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Map() {
  const [trafficFilters, setTrafficFilters] = React.useState([""]);
  const [incidentFilters, setIncidentFilters] = React.useState([""]);

  const handleTrafficFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes('show-all')) newFilters = ["accidents","city-cams","highway-cams"];
    if (newFilters.includes('hide-all')) newFilters = [];

    setTrafficFilters(newFilters);
  };

  const handleIncidentFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[]
  ) => {
    if (newFilters.includes('show-all')) newFilters = ["accidents","roadworks","closures"];
    if (newFilters.includes('hide-all')) newFilters = [];

    setIncidentFilters(newFilters);
  };

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Map">
        <Container sx={{ my: 3}}>
          <Typography fontWeight="Bold" sx={{ my: 2 }}>Traffic Camera Filters</Typography>
          <ToggleButtonGroup
            value={trafficFilters}
            onChange={handleTrafficFilters}
            size={isScreenSmall ? "small" : "medium"}
            color="primary"
          >
            <ToggleButton value="accidents">Accident Zone</ToggleButton>
            <ToggleButton value="city-cams">City Cameras</ToggleButton>
            <ToggleButton value="highway-cams">Highway Cameras</ToggleButton>
            <ToggleButton value="show-all">Show all</ToggleButton>
            <ToggleButton value="hide-all">Hide all</ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <Container sx={{ my: 3}}>
          <Typography fontWeight="Bold" sx={{ my: 2 }}>Incidents Filters</Typography>
          <ToggleButtonGroup
            value={incidentFilters}
            onChange={handleIncidentFilters}
            size={isScreenSmall ? "small" : "medium"}
            color="primary"
          >
            <ToggleButton value="accidents">Accidents</ToggleButton>
            <ToggleButton value="roadworks">Roadworks</ToggleButton>
            <ToggleButton value="closures">Closure</ToggleButton>
            <ToggleButton value="show-all">Show all</ToggleButton>
            <ToggleButton value="hide-all">Hide all</ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <Container sx={{ my: 3}}>
          <Typography fontWeight="Bold" sx={{ my: 2 }}>Search Route</Typography>
          <Stack direction="row" spacing={2} sx={{'& > :not(style)': {width: '35ch' }, my:2}}>
            <TextField  label="Source" variant="outlined"/>
            <TextField  label="Destination" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">Search</Button>
            <Button variant="contained">Save Route</Button>
            <Button variant="contained">View Favourites</Button>
          </Stack>
        </Container>
        <Container>
          <MapComponent location={{lng: 103.851959, lat: 1.290270, address:"Singapore"}} zoomLevel={12}/>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}
