import { useEffect, useState, FC } from "react";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppFrame from "../components/AppFrame";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Alert, Box, Card, Link, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { TrafficChart } from "../components/SpecificTrafficChart";
import React from "react";
import Title from "../components/Title";
import { Paper } from "../components/ComponentsIndex";
import { animateScroll as scroll } from "react-scroll";
import { useParams } from "react-router-dom";

interface Traffic {
  vehicle_avg?: number;
  vehicle_total?: number;
  vehicle_count?: number;
  time_of_day: string;
}

interface CameraData {
  camera_id: string;
  date: Date;
  camera_name: string;
  location: {
    lat: number;
    long: number;
  };
  vehicle_count: number;
  peakedness?: number;
  url?: string;
}
interface TrafficTrendProps {
  oneCameraTrends: Traffic[];
  currentCarCount: number;
}

const defaultTheme = createTheme();

export default function CameraPage() {
  const [camera, setCamera] = useState<CameraData[]>([]);
  const [cameraName, setCameraName] = useState<string>("");
  const [isValidCamera, setIsValidCamera] = useState(false);
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
  const cameraIds = [
    "6529c76346a5bed445508243",
    "6529c76546a5bed44550824f",
    "6529c77146a5bed445508299",
    "6529c77646a5bed4455082b7",
  ];
  const [isTrafficLoaded, setIsTrafficLoaded] = useState(false);
  const [isCurrentTrafficLoaded, setIsCurrentTrafficLoaded] = useState(false);
  const [trafficData, setTrafficData] = useState([]);
  const [oneCameraTrends, setOneCameraTrends] = useState([]);
  const [currentCarCount, setCurrentCarCount] = useState<number>(0);
  const [showTrafficChart, setShowTrafficChart] = useState(false);
  const [timeRetrieved, setTimeRetrieved] = useState<string>("");
  const { cameraId } = useParams();

  const getTrafficData = (cameraId: string) => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/traffic/trends/${cameraId}`)
      .then((res) => {
        if (res.status === 200) {
          setTrafficData(res.data.hourly_counts);
          setIsTrafficLoaded(true);
        } else {
          console.error("Failed to fetch data: Invalid status code");
          setIsTrafficLoaded(false);
        }
      })
      .catch(function (error) {
        console.error("Failed to fetch data:", error);
        setIsTrafficLoaded(false);
      });
  };

  const getTrafficCameraData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/traffic/conditions`
      );
      
      const allCameras: CameraData[] = response.data.cameras;

      let cameraArray: Array<CameraData> = [];

      allCameras.forEach(
        ({ camera_name, location, vehicle_count, peakedness }: CameraData) => {
          cameraArray.push({
            camera_id: "",
            date: new Date(),
            camera_name: camera_name,
            location: {
              lat: location.lat,
              long: location.long,
            },
            vehicle_count: vehicle_count,
            peakedness: peakedness,
          });
        }
      );

      setCamera(cameraArray);
    } catch (error) {
      
    }
  };

  const getOneTrafficCameraTrends = (cameraId: string) => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/traffic/trends/${cameraId}`)
      .then((res) => {
        if (res.status === 200) {
          setOneCameraTrends(res.data.hourly_counts);
        } else {
          console.error("Failed to fetch data: Invalid status code");
        }
      })
      .catch(function (error) {
        console.error("Failed to fetch data:", error);
      });
  };

  const getCurrentData = (cameraId: string) => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/traffic/conditions/${cameraId}`)
      .then((res) => {
        setCurrentCarCount(res.data["vehicle_count"] ?? null);
        setTimeRetrieved(res.data["taken_at"]);
      })
      .then((res) => setIsCurrentTrafficLoaded(true))
      .catch(function (error) {
        console.log(error);
        setIsCurrentTrafficLoaded(false);
      });
  };


  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/traffic/conditions`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const parsedData: Array<CameraData> = data; 
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
    try {
      // Use await
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/traffic/conditions`);
      // Now no need .then(), can just use the response as if you waited
      if (!response.ok) {
        throw Error("Error found");
      }
      
      const allData = await response.json();
      setCamera(allData.cameras);
      setDate(new Date(allData.date));

     
      if (!cameraId) return;

      let hasFoundCamera = false;
      for (let i = 0; i < allData.cameras.length; i++) {
        if (allData.cameras[i].camera_id == cameraId) {
          hasFoundCamera = true;
          const foundCamera = allData.cameras[i];
          setCameraData({
            camera_id: foundCamera.camera_id,
            date: new Date(foundCamera.date),
            camera_name: foundCamera.camera_name,
            location: {
              lat: foundCamera.location.lat,
              long: foundCamera.location.long,
            },
            vehicle_count: foundCamera.vehicle_count,
            peakedness: foundCamera.peakedness,
            url: foundCamera.url,
          });
          break;
        }
      }

      if (!hasFoundCamera) return;

      setShowTrafficChart(true);
      getCurrentData(cameraId);
      getOneTrafficCameraTrends(cameraId);
    } catch (err: any) {
    }
  };
  useEffect(() => {
    fetchAllCameras();
  }, []);

  const handleCameraNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputCameraName = event.target.value;
    setCameraName(inputCameraName);
    let hasFoundCamera = false;
    for (let i = 0; i < camera.length; i++) {
      if (camera[i].camera_name === inputCameraName) {
        hasFoundCamera = true;
        break;
      }
    }
    if (hasFoundCamera) {
      setIsValidCamera(true);
    } else {
      setIsValidCamera(false);
    }
  };

  const handleSearchClick = () => {
    if (cameraData && cameraData.camera_name == cameraName) return;

    if (!isValidCamera) {
      setError("Camera not found. Please check the camera name and try again.");
      return;
    }
    setError(null);

    let foundCamera: CameraData | null = null;

    for (let i = 0; i < camera.length; i++) {
      if (camera[i].camera_name === cameraName) {
        foundCamera = camera[i];
        setCameraData({
          camera_id: foundCamera.camera_id,
          date: new Date(foundCamera.date),
          camera_name: foundCamera.camera_name,
          location: {
            lat: foundCamera.location.lat,
            long: foundCamera.location.long,
          },
          vehicle_count: foundCamera.vehicle_count,
          peakedness: foundCamera.peakedness,
          url: foundCamera.url,
        });
        break;
      }
    }

    if (!foundCamera) return;

    setShowTrafficChart(true);
    getCurrentData(foundCamera.camera_id);
    
    getOneTrafficCameraTrends(foundCamera.camera_id);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppFrame pageName="Road Conditions">
        <Container sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search for Camera
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="cameraName"
                label="Camera Name"
                variant="outlined"
                value={cameraName}
                onChange={handleCameraNameChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" onClick={handleSearchClick}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
        {error && (
          <Container sx={{ my: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        )}
        {cameraData && showTrafficChart && (
          <Paper sx={{ backgroundColor: "#bcd1ef", my: 2, p: {xs:1, md:4}}}>
          <Typography align="center" pt={{xs:2,md:0}} pb={{xs:2,md:2}} variant="h6" fontSize={20}> Live Camera View </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {cameraData ? (
                <Card sx={{ height: "100%"}}>
                <CardActions>
                  <CardMedia
                    component="img"
                    height="300"
                    image={
                      cameraData.url || "https://via.placeholder.com/150"
                    }
                    alt={`Camera Image ${cameraData.camera_id}`}
                  />
                </CardActions>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Camera: {cameraData.camera_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="inline"
                  >
                    Vehicle Count:{" "}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="inline"
                    fontWeight="bold"
                  >
                    {cameraData.vehicle_count}
                  </Typography>
                  {cameraData.peakedness && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="inline"
                      >
                        Peakedness:{" "}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="inline"
                        fontWeight="bold"
                      >
                        {`${(cameraData.peakedness * 100).toFixed(2)}%`}
                      </Typography>
                    </Box>
                  )}
                  {date && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="inline"
                      >
                        Date:{" "}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="inline"
                        fontWeight="bold"
                      >
                        {date.toLocaleString("en-US")}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="inline"
                    >
                      Latitude:{" "}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="inline"
                      fontWeight="bold"
                    >
                      {cameraData.location.lat}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="inline"
                    >
                      Longitude:{" "}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="inline"
                      fontWeight="bold"
                    >
                      {cameraData.location.long}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              ): (
                <Skeleton variant="rectangular" height={500}></Skeleton>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {showTrafficChart ? (
                <Card
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "auto",
                }}
              >
                <TrafficTrend
                  oneCameraTrends={oneCameraTrends}
                  currentCarCount={currentCarCount}
                />
              </Card>
              ) : (
                <Skeleton variant="rectangular" height={500}></Skeleton>
              )}
              
            </Grid>
          </Grid>
        </Paper>
        )}
        <Container sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Live Active Cameras
          </Typography>
          <Grid container>
            {cameraIds.map((cameraId, index) => {
              const cameraData = camera.find(
                (cam) => cam.camera_id === cameraId
              );
              return (
                cameraData ? (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Card sx={{ maxWidth: 500, marginBottom: 1 }}>
                        <CardActions>
                          <CardMedia
                            component="img"
                            height="300"
                            width="500"
                            image={
                              cameraData.url ||
                              "https://via.placeholder.com/150"
                            }
                            alt={`Camera Image ${cameraData.camera_id}`}
                          />
                        </CardActions>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Camera: {cameraData.camera_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vehicle Count: {cameraData.vehicle_count}
                          </Typography>
                          {cameraData.peakedness && (
                            <Typography variant="body2" color="text.secondary">
                              Peakedness:{" "}
                              {`${(cameraData.peakedness * 100).toFixed(2)}%`}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} padding={2} key={index}><Skeleton variant="rectangular" height={400} sx={{maxWidth: 500}}/></Grid>
                )
              );
            })}
          </Grid>
        </Container>
      </AppFrame>
    </ThemeProvider>
  );
}

const TrafficTrend: FC<TrafficTrendProps> = ({
  oneCameraTrends,
  currentCarCount,
}) => {
  if (oneCameraTrends) {
    const data = oneCameraTrends.map((item: Traffic) => ({
      time: item.time_of_day,
      trend: item.vehicle_count ? item.vehicle_count : null,
      current:
        Number(item.time_of_day) === new Date().getHours()
          ? currentCarCount
          : null,
    }));

    const carsNow = currentCarCount; 
    const average =
      data.reduce((acc, curr) => acc + (curr.trend || 0), 0) / data.length;

    return (
      <React.Fragment>
        <TrafficChart data={data} carsNow={carsNow} average={average} />
        <Link color="primary" href="#" sx={{ mt: 3 }}>
          <Container sx={{ my: 3 }}></Container>
        </Link>
      </React.Fragment>
    );
  } else {
    return <Title>Error in loading. Please refresh the page.</Title>;
  }
};

function createData(
  arg0: string,
  arg1: number,
  currentCarCount: number
): { time: string; trend: number | null; current: number | null } {
  throw new Error("Function not implemented.");
}
