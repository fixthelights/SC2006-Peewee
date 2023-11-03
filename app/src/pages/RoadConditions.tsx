import React, { FC, useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import TrafficOutlinedIcon from '@mui/icons-material/TrafficOutlined';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { Photo } from '@mui/icons-material';
import PhotoContainer from '../components/PhotoContainer';
import CameraAPI from '../components/CameraAPI';

interface RoadConditionsProps {
  photos?: string[];
}

interface RoadConditionsState {
  photos: string[];
}

const defaultTheme = createTheme();

class RoadConditions extends Component<RoadConditionsProps, RoadConditionsState> {
  constructor(props: RoadConditionsProps) {
    super(props);
    this.state = {
      photos: [],
    };
  }

  // componentDidMount(): void {
  //   fetch('http://localhost:2000/traffic/conditions')
  //     .then((response: Response) => {
  //       if (!response.ok) {
  //         throw Error('Error found');
  //       }
  //       return response.json();
  //     })
  //     .then((allData: any) => {
  //       this.setState({ photos: allData.cameras });
  //     })
  //     .catch((err: Error) => {
  //       //throw Error(err.message);
  //       console.log(err)
  //     });
  // }

  // Add async to enable "await". Simplier syntax just need to add async if you wanna use await
  async componentDidMount() {
    try{
      // Use await
      const response = await fetch('http://localhost:2000/traffic/conditions');
      // Now no need .then(), can just use the response as if you waited
      if (!response.ok) {
        throw Error('Error found');
      }
      // Everytime smth returns a promise, just await
      const allData = await response.json();
      console.log(allData)
      this.setState({photos: allData.cameras})
    }catch(err: any){
      alert("OMG ERROR")
      console.log(err);
    }
  }

  render(): JSX.Element {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <TrafficOutlinedIcon sx={{ fontSize: 40, color: 'blue' }} />
            <Typography variant="h6" color="inherit" noWrap>
              Road Conditions
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <TrafficOutlinedIcon sx={{ fontSize: 40, color: 'blue' }} />
              <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
                Road Conditions
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                What is traffic looking like today?
              </Typography>
              <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
                <Button variant="contained">Traffic Trends</Button>
                <Button variant="outlined">Traffic Images</Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((card: number) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderWidth: 1,
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '70%',
                        borderWidth: 0.1,
                      }}
                      image="https://images.data.gov.sg/api/traffic-images/2023/10/e461432d-7643-4735-9504-86048e8af35d.jpg"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Traffic Images
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">View</Button>
                      <Button size="small">Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* Render the ImageAPI component here */}
          {this.state.photos.length !== 0 && <PhotoContainer photos={this.state.photos} />}
          
        </main>

        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
          {/* Add your Copyright component here */}
        </Box>
      </ThemeProvider>
    );
  }
}

export default RoadConditions;