import React from "react";
import './Landing.css'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios'
import {useState} from 'react'

function Landing() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([])
    const [email, setEmail] = useState('qwe@ymail.com')

    function testBackend() {
        let message = ''

        axios.post('http://localhost:2000/users/login',{
            username: "hiiii",
            password: "testing1234",
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error)
        });

        /*axios.get('http://localhost:2000/users')
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });*/

        /*axios.post('http://localhost:2000/users/register',{
            username: "hiiii",
            email: "hehe@highmail.com",
            password: "testing123",
            firstName: "hiiii",
            lastName: "hiiii",
            phone: "hiiiii"
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });*/
    }

        /*axios.post('http://localhost:2000/users/register', {
            email: "wooooo@gmail.com",
            password: "wooooo322"
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });*/
        
        /*axios.post('http://localhost:2000/reports/', {
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
        });*/

    const testRG = () => {
        axios.get("https://eu1.locationiq.com/v1/reverse?key=pk.565aea3b0b4252d7587da4689cd6869e&lat=1.3483&lon=103.6831&format=json")
        .then((res)=> console.log(res.data['display_name']))
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
                <Button 
                    variant="contained" 
                    onClick={testRG}
                >
                    Test Reverse Geolocation
                </Button>
            </Stack>
        </div>
    );
};
  
export default Landing;