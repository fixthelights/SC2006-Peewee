const CronJob = require("node-cron");
import Camera from '../models/camera';
import Picture from '../models/picture';
import Trend from '../models/trend';

import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import axios from "axios";

const initScheduledJobs = () => {
  const generateTrafficDataPeriodically = CronJob.schedule(
    "*/10 * * * *",
    async () => {
      console.log(
        `Starting Traffic Data Generation Job at ${new Date().toLocaleString()}!`
      );

      // Fetch current traffic images from LTA API
      const ltaApiRes = await axios.get(
        "https://api.data.gov.sg/v1/transport/traffic-images"
      );
      let items = ltaApiRes.data.items;

      // Loop through all cameras
      for (let camera of items[0].cameras) {
        // Find existing camera by camera_id, if not found create a new camera (upsert: true)
        const model = await Camera.findOneAndUpdate(
          { camera_name: camera.camera_id },
          {
            location: {
              lat: camera.location.latitude,
              long: camera.location.longitude,
            },
          },
          { new: true, upsert: true }
        );

        const date = new Date(camera.timestamp);

        // Find existing picture with "date" and "camera_id"
        let picture = await Picture.findOne({
          date: date,
          camera_id: model.id,
        });

        if (picture != undefined) {
          // if picture with exact "date" and "camera_id" exists, skip
          continue;
        }

        // Send image to AI for processing
        try {
          const url = camera.image;
          const result = await axios.post(
            `http://localhost:8080/detect-url?url=${url}`,
            {
              timeout: 3000,
            }
          );
          const data = result.data;
          let vehicle_count = 0;

          for (let vehicle_type in data) {
            vehicle_count += data[vehicle_type];
          }

          picture = new Picture();

          picture.date = date;
          picture.camera_id = model.id;
          picture.vehicle_count = vehicle_count;
          picture.url = url;

          await picture.save();
        } catch (error) {
          console.log("Error proccessing an image!", error);
        }
      }
      console.log(`Done! at ${new Date().toLocaleString()}`);
      return;
    }
  );

  const generateTrendsPeriodically = CronJob.schedule("0 0 * * *", async () => {
    console.log(
      `Starting Trends Generation Job at ${new Date().toLocaleString()}!`
    );

    interface Trend {
      time_of_day: number; // In hour
      vehicle_count: number;
    }

    // Get yesterday's date only, exclude time by using .toDateString()
    const targetDate = new Date(new Date().toDateString());
    targetDate.setDate(targetDate.getDate() - 1);

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
          last_updated: Date.now()
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Done! at ${new Date().toLocaleString()}`);
  });

  generateTrafficDataPeriodically.start();
  generateTrendsPeriodically.start();
};

export default { initScheduledJobs };
