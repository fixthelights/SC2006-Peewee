import React, { useEffect, useState } from 'react';

class ReportController{
    getUserLocation(): string{
      this.getUserCoordinates();
        // return this.convertCoordinatesToLocation(this.getUserCoordinates());
        return "NTU";
    }

    getUserCoordinates(): void{
       navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      });
    }

    /*convertCoordinatesToLocation(list: Array<number>): Promise<string | undefined>{
        let latitude = list[0];
        let longitude = list[1];
        return new Promise((resolve) => {
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
          })

    }*/

    saveReport(incidentLocation: string, incidentType: string, incidentDescription: string): boolean{
      // save to database
      // if successful return true
      // else return false
      return true;
    }
}

export {ReportController};