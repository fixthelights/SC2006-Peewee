import React from "react";
import './Landing.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {Button, Stack, Box, Container, Grid} from '../components/ComponentsIndex'
import {ActionAreaCard} from "../components/ActionAreaCard";
import Photo from '../assets/Landing2.jpg'
import DataPhoto from '../assets/Data2.png'
import AIPhoto from '../assets/AI.jpg'
import HMPhoto from '../assets/Heatmap.png'
import SearchPhoto from '../assets/Search.png'
import StickyFooter from "../components/StickyFooter";

interface user{
    userId: String,
    email: String, 
    iat: Number,
    exp: Number
}

function Landing() {
    const navigate = useNavigate();

    function testBackend(): void {

        axios.delete("http://localhost:2000/reports/6544e07cbd8a9bcd2f16f534")
        .then((res) => console.log(res.data))
        .catch(function (error) {
            console.log(error);
        });

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
                {/*<Button 
                    variant="contained" 
                    onClick={testBackend}
                >
                    Log In
                </Button>*/}
            </Stack>
            </div>
            <div>
            <div className="Landing-content-2">
            <Stack direction='column'>
            <Stack 
                spacing={15}
                direction='row'
                useFlexGap flexWrap="wrap"
                sx={{pl: 5, pb:2}}
        >
                <ActionAreaCard 
                    image={DataPhoto}
                    title='Data-driven'
                    description='Harness real-time traffic image data to show the latest traffic conditions'/>
                <ActionAreaCard 
                    image={AIPhoto}
                    title='AI-powered'
                    description='Utilises artificial intelligence to provide real-time analysis of traffic'/>
                <ActionAreaCard 
                    image={HMPhoto}
                    title='Traffic visualisation'
                    description='Plots heatmaps and traffic pointers to enable better visualisation of traffic conditions'/>
                <ActionAreaCard 
                    image={SearchPhoto}
                    title='Route finder'
                    description='Seamless searching of driving routes'/>
                </Stack>
                <StickyFooter />
                </Stack>
                {/*</Box>*/}
        </div>
        </div>
        </div>
    );
};
  
export default Landing;