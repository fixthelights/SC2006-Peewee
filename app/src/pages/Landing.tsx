import React from "react";
import './Landing.css'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios'

function Landing() {
    const navigate = useNavigate();
    const testBackend = () => {
        axios.post('http://localhost:2000/reports/', {
            incident: "Accident",
            description: "Accident at Jurong West St 64",
            location: {
                lat: 1.339808,
                long: 103.704116
            },
            duration_hours: "12"
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });
    }
    return (
        <div className='Landing'>
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
                <Button 
                    variant="contained" 
                    onClick={testBackend}
                >
                    Test Backend 
                </Button>
            </Stack>
        </div>
    );
};
  
export default Landing;