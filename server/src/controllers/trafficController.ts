import express, { Request, Response } from "express";
import axios from "axios";
import { AppError } from "../config/AppError";

import Camera from "../models/camera";
import Picture from "../models/picture";
import Trend from "../models/trend";

import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import { ObjectId } from "mongoose";

exports.getTrendsAllCameras = async (req: Request, res: Response) => { 
  const trends = await Trend.aggregate([
    { $unwind: "$hourly_counts" },
    {
      $project:{
        _id: "$_id",
        hourly_counts: "$hourly_counts"
      }
    },
    {
      $group: {
        _id: "$hourly_counts.time_of_day",
        vehicle_avg: { $avg: "$hourly_counts.vehicle_count"},
        vehicle_total: { $sum: "$hourly_counts.vehicle_count"}
      },
    },
    {
      $addFields: {
        time_of_day: "$_id",
        vehicle_avg: { $round: ["$vehicle_avg", 0] },
      },
    },
    {
      $project:{_id: 0}
    },
    {
      $sort: { time_of_day: 1}
    }
  ]);
  res.status(200).send(trends);
}

exports.getTrafficConditionsOneCamera = async (req: Request, res: Response) => { 
  const camera_id = req.params.cameraId;
  
  try{
    const picture = (await Picture.find({camera_id: camera_id}).sort({ date: -1}).limit(1))[0];
    const camera = await Camera.findOne({_id: picture.camera_id });

    if (!camera || !camera.location) {
      throw new AppError({
        statusCode: 500, 
        description: "Cannot find Camera!"
      });
    }

    const output= {
      date: picture.date,
      camera_name: camera.camera_name,
      camera_id: picture.camera_id._id,
      location: {
        long: camera.location.long,
        lat: camera.location.lat
      },
      url: picture.url,
      vehicle_count: picture.vehicle_count
    }
    return res.status(200).send(output);
  }catch(error:any){
    throw new AppError({
      error: error,
      statusCode: 500, 
      description: "Error getting latest traffic conditions!"
    });
  }
}

exports.getTrafficConditionsAllCameras =  async (req: Request, res: Response) => { 
  let date;
  
  try{
    const picture = await Picture.find().sort({ date: -1 }).limit(1);
    date = picture[0].date;
  }catch(error:any){
    throw new AppError({
      error: error, 
      statusCode:500, 
      description: "Error finding latest picture"
    });
  }

  interface condition {
    camera_name: string,
    camera_id: ObjectId,
    location: {
      lat: number,
      long: number
    },
    url: string,
    vehicle_count: number
  }

  interface conditions {
    date: Date,
    camera_count: number,
    cameras: condition[]
  }

  interface Camera{
    camera_name: string,
    _id: ObjectId,
    location: {
      long: number,
      lat: number
    }
  }

  let cameras : condition[] = [];

  try{
    const pictures = await Picture.find({date: date})
    .populate<{camera_id: Camera}>({ path: 'camera_id'});

    for (let picture of pictures){
      cameras.push({
        camera_name: picture.camera_id.camera_name,
        camera_id: picture.camera_id._id,
        location: {
          long: picture.camera_id.location.long,
          lat: picture.camera_id.location.lat 
        },
        url: picture.url,
        vehicle_count: picture.vehicle_count
      });
    }

    const conditions = {
      date: date.toLocaleString(),
      camera_count: pictures.length,
      cameras: cameras
    }

    return res.status(200).send(conditions);
  }catch(error:any){
    throw new AppError({
      error: error, 
      statusCode: 500, 
      description: "Error getting latest traffic conditions!"
    });
  }  
}

exports.generateTrends = async (req: Request, res: Response) => {
  console.log(
    `Starting Trends Generation Job at ${new Date().toLocaleString()}!`
  );

  interface Trend {
    time_of_day: number; // In hour
    vehicle_count: number;
  }

  // Get yesterday's date only, exclude time by using .toDateString()
  const targetDate = new Date(new Date().toDateString());
  targetDate.setDate(targetDate.getDate());

  console.log(`target date: ${targetDate.toISOString()}`);
  console.log(`startOfDay: ${startOfDay(targetDate)}`);
  console.log(`endOfDay: ${endOfDay(targetDate)}`);

  const cameras = await Camera.find();
  for (let camera of cameras) {
    let trends: Trend[] = [];

    const pictureTrends = await Picture.aggregate([
      {
        $match: {
          camera_id: camera._id,
          date: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%H",
              date: "$date",
              timezone: "+08:00",
            },
          },
          vehicle_count: { $avg: "$vehicle_count" },
          total: { $sum: "$vehicle_count" },
        },
      },
      {
        $addFields: {
          rounded_count: { $round: ["$vehicle_count", 0] },
          _id: { $toInt: "$_id" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    for (let pictureTrend of pictureTrends) {
      trends.push({
        time_of_day: pictureTrend._id,
        vehicle_count: pictureTrend.rounded_count,
      });
    }

    const trend = await Trend.findOneAndUpdate(
      { camera_id: camera.id },
      {
        location: camera.location,
        hourly_counts: trends,
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Done! at ${new Date().toLocaleString()}`);
  return res.status(200).send(await Trend.find());
};
