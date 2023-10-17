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

        /*axios.delete('http://localhost:2000/reports/652d17fc4c366326759ebfbe')
        .then ((res) => console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });*/

        axios.get('http://localhost:2000/routes')
        .then ((res) => console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });

        /*axios.post('http://localhost:2000/reports/', {
            incident: "Accident",
            description: "Accident at Jurong West St 64",
            address : "daNDJK",
            location: {
                lat: 1.339808,
                long: 103.704116
            },
            duration_hours: "12"
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        })*/

        /*axios.post('http://localhost:2000/users/forget-password',{
            username: "hii",
            email: "p90027408@gmail.com",
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error.message);
        });*/

        /*axios.post('http://localhost:2000/users/register',{
            username: "hii",
            email: "p90027408@gmail.com",
            password: "12345testing",
            firstName: "1123hiiii",
            lastName: "123hiiii",
            phone: "123hiiiii"
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error);
        });*/

        /*axios.post('http://localhost:2000/users/login',{
            username: "hiiii",
            password: "testing123",
        })
        .then((res)=> console.log(res.data))
        .catch(function(error) {
            console.log(error.message)
        });*/

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