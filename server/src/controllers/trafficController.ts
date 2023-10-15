import { Request, Response} from "express";
import { AppError } from "../config/AppError";

import Camera from "../models/camera";
import Picture from "../models/picture";
import Trend from "../models/trend";

import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import { ObjectId } from "mongoose";


exports.getConsolidatedTrafficConditions = async (req: Request, res: Response) => {
  const date = await getLatestProcessingDate();

  const getDocumentFromDB = Picture.aggregate([
    {
      $match: { date: date }
    },
    {
      $group: {
        _id: null,
        camera_count: { $sum: 1 },
        vehicle_total: { $sum: "$vehicle_count" },
        vehicle_avg: { $avg: "$vehicle_count" }
      }
    },
    {
      $addFields: {
        vehicle_avg: { $round: "$vehicle_avg" }
      }
    },
    {
      $project: {
        camera_count: 1,
        taken_at: date.toLocaleString(),
        vehicle_total: 1,
        vehicle_avg: 1,
        _id: 0
      }
    }
  ]);

  let trafficConditions;

  try {
    trafficConditions = await getDocumentFromDB;
  } catch (error: any) {
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Unexpected Error fetching traffic conditions!"
    });
  }

  if (trafficConditions.length !== 1) {
    throw new AppError({
      statusCode: 404,
      description: "Error fetching traffic conditions: Not found!"
    });
  }

  res.status(200).send(trafficConditions[0]);
}

exports.getTrafficConditionsAllCameras = async (req: Request, res: Response) => {
  const date = await getLatestProcessingDate();

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

  interface Camera {
    camera_name: string,
    _id: ObjectId,
    location: {
      long: number,
      lat: number
    }
  }

  let cameras: condition[] = [];

  try {
    const pictures = await Picture.find({ date: date })
      .populate<{ camera_id: Camera }>({ path: 'camera_id' });

    for (let picture of pictures) {
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
  } catch (error: any) {
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Error fetching latest traffic conditions!"
    });
  }
}

exports.getTrafficConditionsOneCamera = async (req: Request, res: Response) => {
  const latestProcessingDate = await getLatestProcessingDate();
  const camera_id = req.params.cameraId;

  try {
    const picture = await Picture.findOne({ camera_id: camera_id, date: latestProcessingDate})
    const camera = await Camera.findOne({ _id: picture?.camera_id });

    if (!picture || !camera || !camera.location) {
      throw new AppError({
        type: "CameraNotFoundError",
        statusCode: 404,
        description: "Camera not found!"
      });
    }

    const output = {
      date: picture.date.toLocaleString(),
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
  } catch (error: any) {
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Error fetching latest traffic conditions!"
    });
  }
}


exports.getConsolidatedTrends = async (req: Request, res: Response) => {

  let oneCameraTrends;
  let hourly_counts: any[];

  const getDocumentFromDB = Trend.aggregate([
    { $unwind: "$hourly_counts" },
    {
      $project: {
        _id: "$_id",
        hourly_counts: "$hourly_counts"
      }
    },
    {
      $group: {
        _id: "$hourly_counts.time_of_day",
        vehicle_avg: { $avg: "$hourly_counts.vehicle_count" },
        vehicle_total: { $sum: "$hourly_counts.vehicle_count" }
      },
    },
    {
      $addFields: {
        time_of_day: "$_id",
        vehicle_avg: { $round: ["$vehicle_avg", 0] },
      },
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { time_of_day: 1 }
    }
  ]);

  try {
    hourly_counts = await getDocumentFromDB;
    oneCameraTrends = await Trend.findOne();
  } catch (error: any) {
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Unexpected Error loading trends!"
    });
  }

  const trends = {
    generated_at: oneCameraTrends?.last_updated.toLocaleString(),
    hourly_counts: hourly_counts
  }

  res.status(200).send(trends);
}

exports.getTrendsOneCamera = async (req: Request, res: Response) => {
  const camera_id = req.params.cameraId;
  let trends;

  try {
    trends = await Trend.findOne({ camera_id: camera_id })
      .select(["-_id", "-__v", "-hourly_counts._id"]);
  } catch (error: any) {
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Unexpected Error loading trends!"
    });
  }

  if (!trends) {
    throw new AppError({
      type: "CameraNotFoundError",
      statusCode: 404,
      description: `Error loading trends: camera_id "${camera_id}" not found!`
    });
  }

  const responseJson = {
    camera_id: trends.camera_id,
    last_updated: trends.last_updated.toLocaleString(),
    location: {
      long: trends.location?.long,
      lat: trends.location?.lat
    },
    hourly_counts: trends.hourly_counts
  }

  res.status(200).send(responseJson);
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

const getLatestProcessingDate = async () : Promise<Date> => {
  /*
    Returns the most up to date processing date.
    
    Goal: Detect if photos are currently processing.
    Solution: Fallback to another processing date.
    Criteria: Assume processing if picture count < 90% of camera count
  */

  let date;
  let processingDates = [];

  try{
    processingDates = await Picture.aggregate([
      {$group: {_id: "$date"}},
      {$sort: {_id: -1}},
      {$limit: 2},
      {$unwind: "$_id"}
    ]);
  }catch(error: any){
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Unexpected Error fetching processing dates!"
    });
  }

  if(processingDates.length === 0){
    throw new AppError({
      statusCode: 404,
      description: "Error fetching latest AI processing date: Not found!"
    });
  }

  date = processingDates[0]._id;

  try{
    const pictureCount = await Picture.countDocuments({ date: date });
    const cameraCount = await Camera.countDocuments();

    // If more than one dates exist and less than 90% of pictures have been processed
    if(processingDates.length > 1 && pictureCount < cameraCount * 0.90){
      // Use second date
      date = processingDates[1]._id;
    }
  }catch(error: any){
    throw new AppError({
      error: error,
      statusCode: 500,
      description: "Unexpected Error fetching document counts!"
    });
  }

  return date;
}