import React from "react";
import './Landing.css'
import './index.css'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function Landing() {
    const navigate = useNavigate();
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
            </Stack>
        </div>
    );
};
  
export default Landing;