import React, { FC } from 'react';
import { useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import {ViewRoute} from '../pages/ViewRoute'
import {createTheme, ThemeProvider , CssBaseline, Typography, Button, Alert, Grid, Container, AppFrame, Paper, Stack, Title, Box} from '../components/ComponentsIndex'

interface User{
    userId: string,
    email: string, 
    iat: number,
    exp: number
  }

interface Route {
    source: {
      longitude: Number;
      latitude: Number;
      address: string;
    };
    destination: {
      longitude: Number;
      latitude: Number;
      address: string;
    };
    _id: string
}

const defaultTheme = createTheme();

const userId = identifyUser()

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

export default function FavouriteRoutes() {

  const navigate = useNavigate();
  const [routeList, setRouteList] = useState([])
  const [isRouteLoaded, setIsRouteLoaded] = useState(false)
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [viewMap, setViewMap] = useState(false)

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

  useEffect(() => {
    getFavouriteRouteList();
  }, []);

  const DisplayMessage = () => {
    if (isRouteLoaded && routeList.length===0){
      return <DisplayNoRouteMessage/>
    }
    if (!isRouteLoaded){
      return <DisplayErrorMessage />
    }
    return null;
  }
  
  const DisplayNoRouteMessage = () => {
    return <Alert severity="info">There are no favourite routes saved.</Alert>
  }

  const DisplayErrorMessage = () => {
    return <Alert severity="info">Error in loading. Please refresh the page.</Alert>
  }

  function viewOnMap(source: string, destination: string): void {
    setSource(source)
    setDestination(destination)
    setViewMap(true)
  }

  function unfavouriteRoute(reportId: String): void {
    axios
    .delete("http://localhost:2000/routes/"+reportId)
    .then ((res)=> getFavouriteRouteList())
    .catch(function (error) {
      console.log(error);
    });
  }

  interface RouteListItemProps {
   source: string, 
   destination: string
   routeId: string
  }

  const RouteListItem: FC<RouteListItemProps> = ({source, destination, routeId}) => {
    return <React.Fragment>
            <Grid item xs={12} md={12} lg={10}>
            <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                overflow: 'auto'
            }}
            >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12}>
              <Box sx={{ pl: 2 }}>
              <Stack spacing={2} direction="row">
                <Title >Start: </Title>
                <Box sx={{ pt: 0.5 }}>
                <Typography component="h4" variant="body1" color="black" gutterBottom>
                  {source}
                </Typography>
                </Box>
                </Stack>
                </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                <Box sx={{ pl: 2 }}>
                <Stack spacing={2} direction="row">
                <Title >End:</Title>
                <Box sx={{ pt: 0.5 }}>
                <Typography component="h4" variant="body1" color="black" gutterBottom>
                  {destination}
                </Typography>
                </Box>
                </Stack>
                </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                <Stack spacing={2} direction="row" paddingX={1} paddingY={1}>
                    <Button 
                            variant="contained" 
                            onClick={() => viewOnMap(source, destination)}
                        >
                        View on map
                    </Button>
                    <Button 
                            variant="contained" 
                            onClick={() => unfavouriteRoute(routeId)}
                        >
                        Unfavourite
                    </Button>
                </Stack>
                </Grid>
            </Grid>
            </Paper>
        </Grid>
        </React.Fragment>
  }

  const DisplayRoutesOrMap = () => {
    if (viewMap){
        return <ViewRoute source={source} destination={destination} setViewMap={setViewMap}></ViewRoute>
    }
    else {
        return <ThemeProvider theme={defaultTheme}>
                <CssBaseline />
                <AppFrame pageName="Favourite Routes">
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                        </Grid>
                        {routeList.map((route: Route) => (
                        <RouteListItem 
                        source={route.source.address}
                        destination={route.destination.address}
                        routeId={route._id}
                        />
                        ))}
                        <Grid item sx={{pt:2}}>
                            <DisplayMessage/>
                        </Grid>
                    </Grid>
                    </Container>
                </AppFrame>
            </ThemeProvider>
    }
  }

  return (
    <DisplayRoutesOrMap />
  );
}