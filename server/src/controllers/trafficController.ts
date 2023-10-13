import express, { Request, Response } from 'express';
import axios from 'axios';
import { AppError } from '../config/AppError';
import Camera from '../models/camera';
import Picture from '../models/picture';

exports.getCurrentTrafficCondition = async (req :Request, res :Response) => {
    const ltaApiRes = await axios.get("https://api.data.gov.sg/v1/transport/traffic-images");
    let items = ltaApiRes.data.items;
    let date;

    for(let camera of items[0].cameras){
        const name = camera.camera_id;
        const location = {
            lat: camera.location.latitude,
            long: camera.location.longitude
        }
        const model = await Camera.findOneAndUpdate({camera_name: name},{location: location},{
            new: true,
            upsert: true
        });

        date = new Date(camera.timestamp);

        let picture = await Picture.findOne({date: date, camera_id: model.id});

        if(picture != undefined){
            continue;
        }

        const url = camera.image;
        const result = await axios.post(`http://localhost:8080/detect-url?url=${url}`);
        const data = result.data;
        let vehicle_count = 0;

        for (let vehicle_type in data){
            vehicle_count += data[vehicle_type]
        }

        picture = new Picture;

        picture.date = date;
        picture.camera_id = model.id;
        picture.vehicle_count = vehicle_count;
        picture.url = url;

        await picture.save()
    }
    return date;
}