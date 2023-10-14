import express, { Request, Response } from "express";
import axios from "axios";
import { AppError } from "../config/AppError";

import Camera from "../models/camera";
import Picture from "../models/picture";
import Trend from "../models/trend";

import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";

exports.getCurrentTrafficCondition = async (req: Request, res: Response) => {
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
