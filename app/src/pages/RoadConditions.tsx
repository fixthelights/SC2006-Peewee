import { useEffect, useState,FC } from "react";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppFrame from "../components/AppFrame";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Alert, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';



interface CameraData {
  camera_id: string;
  date: Date;
  camera_name: string;
  location: {
    lat: number;
    long: number;
  };
  vehicle_count: number;
  peakedness: number;
  url?: string;
}

const defaultTheme = createTheme();


export default function CameraPage() {
  const [camera, setCamera] = useState<Array<CameraData>>([]);
  const [cameraName, setCameraName] = useState<string>("");
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [cameraImages, setCameraImages] = useState<Array<CameraData>>([]);
  const placeholderImages = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];
  const cameraIds = ['6529c76346a5bed445508243', '6529c76546a5bed44550824f', '6529c77146a5bed445508299', '6529c77646a5bed4455082b7'];
  

  
  

  // const fetchCameraData = async () => {
  //   try {
  //     const response = await axios.get<CameraData>(
  //       `http://localhost:2000/traffic/conditions/${cameraData}`
  //     );
  //     setCameraData(response.data);
  //   } catch (error) {
  //     setError(
  //       "Error fetching camera data. Please check the camera name and try again."
  //     );
  //   }
  // };


  useEffect(() => {
    // Fetch data from the API and update the state
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:2000/traffic/conditions");
        const data = await response.json();
        // Assuming the API returns an array of camera data
        if (data && data.length > 0) {
          const parsedData: Array<CameraData> = data; // Assuming 'data' is an array of 'CameraData'
          setCamera(parsedData);
          const filteredImages = parsedData.filter((cameraData: CameraData) =>
            [41, 45, 62, 69].includes(Number(cameraData.camera_id))
          );
          setCameraImages(filteredImages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const fetchAllCameras = async () => {
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
      setCamera(allData.cameras)
      setDate(new Date(allData.date));
    }catch(err: any){
      alert("OMG ERROR")
      console.log(err);
    }
  }
  useEffect(() => {
    fetchAllCameras();
  }, []);

  const handleCameraNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputCameraName = event.target.value;
    let hasFoundCamera = false
    for (let i = 0; i < camera.length; i++) {
      if (camera[i].camera_name === inputCameraName) {
        let foundCamera = camera[i];
        setCameraData({
          camera_id: foundCamera.camera_id,
          date: new Date(foundCamera.date),
          camera_name: inputCameraName,
          location: { lat: foundCamera.location.lat, long: foundCamera.location.long },
          vehicle_count: foundCamera.vehicle_count,
          peakedness: foundCamera.peakedness,
          url: foundCamera.url,
        });
        hasFoundCamera = true
        break;
      }
    }
    if (hasFoundCamera) {
      setCameraName(inputCameraName);
      setError(null);
    } else {
      setCameraName(inputCameraName);
      setCameraData(null);
      setError("Camera not found. Please check the camera name and try again.");
    }
  };
  const handleSearchClick = () => {
    const event = {
      target: {
        value: cameraName
      }
    };
    handleCameraNameChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Camera Page">
        <Container sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search for Camera Location
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="cameraName"
                label="Camera Name"
                variant="outlined"
                value={cameraName}
                onChange={(event) => setCameraName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained"onClick={handleSearchClick}>
              Search
              </Button>
            </Grid>
          </Grid>
        </Container>
        <Container sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Active Cameras
          </Typography>
          <Grid container spacing={2}>
            {cameraIds.map((cameraId, index) => {
              const cameraData = camera.find((cam) => cam.camera_id === cameraId);
              return (
                cameraData && (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ maxWidth: 500, marginBottom: 1 }}>
                      <CardActions>
                        <CardMedia
                          component="img"
                          height="300"
                          image={cameraData.url || 'https://via.placeholder.com/150'}
                          alt={`Camera Image ${cameraData.camera_id}`}
                        />
                      </CardActions>
                      <CardContent>
      
                        <Typography variant="body2" color="text.secondary">
                          Vehicle Count: {cameraData.vehicle_count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Peakedness: {cameraData.peakedness}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              );
            })}
          </Grid>
        </Container>
        {error && (
          <Container sx={{ my: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        )}
        {cameraData && (
          <Container sx={{ my: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Camera Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Camera ID: {cameraData.camera_id}
            </Typography>
            {date && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                Date: {date.toLocaleString('en-US')}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 1 }}>
              Latitude: {cameraData.location.lat}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Longitude: {cameraData.location.long}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Vehicle Count: {cameraData.vehicle_count}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Peakedness: {cameraData.peakedness}
            </Typography>
            {cameraData.url && (
              <img src={cameraData.url} alt="Camera Feed" style={{ maxWidth: "100%" }} />
            )}
          </Container>
        )}
        
      </AppFrame>
    </ThemeProvider>
  );


  
}