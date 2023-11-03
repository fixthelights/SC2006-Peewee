import React from "react";
import './Landing.css'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios'
import Photo from '../assets/LoginBackground.jpg'
import {useState} from 'react'
import jwt from 'jsonwebtoken';

interface user{
    userId: String,
    email: String, 
    iat: Number,
    exp: Number
}

function Landing() {
    const navigate = useNavigate();

    function testBackend(): void {

        /*axios.get("http://localhost:2000/users")
        .then((res) => console.log(res.data))
        .catch(function (error) {
            console.log(error);
        });*/

        /*axios.delete("http://localhost:2000/reports/654352e32b792a5a0811abf7")
        .then((res) => console.log(res.data))
        .catch(function (error) {
            console.log(error);
        });*/

        /*axios.get("http://localhost:2000/reports")
        .then((res) => console.log(res.data))
        .catch(function (error) {
            console.log(error);
        });*/

        /*axios
        .delete("http://localhost:2000/reports/65413b92090a35bacfb7bff4")
        .then((res) => console.log(res.data))
        .catch(function (error) {
            console.log(error);
        });*/

        /*axios
        .get("http://localhost:2000/traffic/combined-conditions")
        .then((res) => {console.log(res.data)})
        .catch(function (error) {
            console.log(error);
        });*/

        /*axios
        .get("http://localhost:2000/routes")
        .then((res) => console.log(res.data[0]["_id"]))
        .catch(function (error) {
            console.log(error);
        });*/

        /*let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
        const userDetails: user = jwtDecode(userJwt)
        console.log(userDetails.userId)*/
        /*axios
        .post("http://localhost:2000/users/register",
        {
            email: "hahaha@ymail.com",
            password: "Hahaha*123"
        })
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })*/

        /*axios.post("http://localhost:2000/routes",
        {
            favourited_by: "653bd957ff600f6066e5b2da",
            source: {
                longitude: 1.234,
                latitude: 1.234,
                address: "Redhill"
            },
            destination: {
                longitude: 1.386, 
                latitude: 1.386,
                address: "Tiong Bahru"
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
        .get("http://localhost:2000/reports")
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.log(error);
        })*/
    }

    function reformatTime(time: string){
        if (time.slice(-2).toLowerCase().slice(-2)==='pm' || time.slice(-2).toLowerCase().slice(-2)==='am' ){
            let currentHour = 12
            let i=0
            let timeString
            while (isNaN(parseInt(time[i]))){
              i++;
            }
            if (time[i+1]==':'){
                if (time.toLowerCase().slice(-2)==='pm'){
                  currentHour += parseInt(time[i])
                }
                else {
                  currentHour = parseInt(time[i])
                }
            } else{
              if (time.substring(i,i+2)==='12' && time.toLowerCase().slice(-2)==='am'){
                currentHour=0
              } else {
                currentHour = parseInt(time.substring(i,i+2))
              }
              i++
            }
            if (currentHour.toString().length===1){
              timeString = "0" + currentHour.toString() + time.substring(i+1, time.length-3)
            } else {
              timeString = currentHour.toString() + time.substring(i+1, time.length-3)
            }
            return timeString
          } else {
            return time
          }
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