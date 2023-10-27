import React from "react";
import './Landing.css'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios'
import {useState} from 'react'

function Landing() {
    const navigate = useNavigate();

    function testBackend(): void {
        axios
        .get("http://localhost:2000/users",)
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })
        /*axios.post("http://localhost:2000/routes",
        {
            favourited_by: "6534d765e1ae557b525d8143",
            source: {
                longitude: 1.22,
                latitude: 1.22,
                address: "Toa Payoh"
            },
            destination: {
                longitude: 1.33, 
                latitude: 1.33,
                address: "Jurong East"
            }
        })
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })*/
        /*axios.post("http://localhost:2000/routes/list",
        {
            id: "6534d765e1ae557b525d8143"
        })
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })*/
        /*axios
        .get("http://localhost:2000/routes")
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })*/
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
                    Log In
                </Button>
            </Stack>
        </div>
    );
};
  
export default Landing;