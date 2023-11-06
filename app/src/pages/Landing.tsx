import './Landing.css'
import { useNavigate } from "react-router-dom";
import {Button, Stack, Grid} from '../components/ComponentsIndex'
import {ActionAreaCard} from "../components/ActionAreaCard";
import Photo from '../assets/Landing2.jpg'
import DataPhoto from '../assets/Data2.png'
import AIPhoto from '../assets/AI.jpg'
import HMPhoto from '../assets/Heatmap.png'
import SearchPhoto from '../assets/Search.png'
import StickyFooter from "../components/StickyFooter";

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="Landing" style={{backgroundImage: `url(${Photo})` }}>
            <div className="Landing-content">
            <h1>Take Control of Your Journey</h1>
            <p>PEEWEE allows you to view traffic conditions in real-time and provides you with the best routes to your destination.</p>
            <Stack spacing={2} direction="row">
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/login")}
                >
                    Log In
                </Button>
                </Stack>
            </div>
            <div className="Landing-content-2">
            <Stack direction="column">
                <Grid container spacing={5} style={{marginTop:"20px"}} sx={{justifyContent:'center'}}>
                <Grid item>
                <ActionAreaCard 
                    image={DataPhoto}
                    title='Data-driven'
                    description='Harness real-time traffic image data to show the latest traffic conditions'/>
                </Grid>
                <Grid item>
                <ActionAreaCard 
                    image={AIPhoto}
                    title='AI-powered'
                    description='Utilises artificial intelligence to provide real-time analysis of traffic'/>
                </Grid>
                <Grid item>
                <ActionAreaCard 
                    image={HMPhoto}
                    title='Traffic visualisation'
                    description='Plots heatmaps and traffic pointers to enable better visualisation of traffic conditions'/>
                </Grid>
                <Grid item>
                <ActionAreaCard 
                    image={SearchPhoto}
                    title='Route finder'
                    description='Seamless searching of driving routes'/>
                </Grid>
                </Grid>
                <StickyFooter />
                    </Stack>
                </div>
        </div>
    );
};
  
export default Landing;