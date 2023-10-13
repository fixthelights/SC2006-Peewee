import React, { useEffect, useState } from 'react';
import axios from 'react';

class ReportController{

    getUserLocation(){
      let coordinates=[];
      coordinates=this.getUserCoordinates();
        // return this.convertCoordinatesToLocation(this.getUserCoordinates());
      return "NTU";
    }

    getUserCoordinates(): Array<number>{
      let latitude=1000; // default value for error checking 
      let longitude=1000;
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude
      });
      return [latitude, longitude]
    }

    /*convertCoordinatesToLocation(list: Array<number>): {
        let latitude = list[0];
        let longitude = list[1];
        /*axios.get(`https://eu1.locationiq.com/v1/reverse?key=pk.565aea3b0b4252d7587da4689cd6869e&lat=${latitude}&lon=${longitude}&format=json`)
        .then((res)=> console.log(res.data['display_name']))
        .catch(function(error) {
            console.log(error);
        });*/

        /*return new Promise((resolve) => {
            const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=41.8842%2C-87.6388%2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=H6XyiCT0w1t9GgTjqhRXxDMrVj9h78ya3NuxlwM7XUs&mode=retrieveAddresses&prox=${latitude},${longitude}`
            fetch(url)
              .then(res => res.json())
              .then((resJson) => {
                // the response had a deeply nested structure :/
                if (resJson
                  && resJson.Response
                  && resJson.Response.View
                  && resJson.Response.View[0]
                  && resJson.Response.View[0].Result
                  && resJson.Response.View[0].Result[0]) {
                  resolve(resJson.Response.View[0].Result[0].Location.Address.Label)
                } else {
                  resolve(undefined)
                }
              })
              .catch((e) => {
                console.log('Error in getAddressFromCoordinates', e)
                resolve(undefined)
              })
          })*/

    saveReport(incidentLocation: string, incidentType: string, incidentDescription: string): boolean{
      // save to database
      // if successful return true
      // else return false
      return true;
    }
}

export {ReportController};