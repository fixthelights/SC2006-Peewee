const CronJob = require("node-cron");
import Camera from '../models/camera';
import Picture from '../models/picture';
import axios from 'axios';

const initScheduledJobs = () => {
  const generateTrafficDataPeriodically = CronJob.schedule("*/10 * * * *", async () => {
      console.log(`Starting Traffic Data Generation Job at ${new Date().toLocaleString()}!`);
      const ltaApiRes = await axios.get(
        "https://api.data.gov.sg/v1/transport/traffic-images"
      );
      let items = ltaApiRes.data.items;
      let date;

      for (let camera of items[0].cameras) {
        const name = camera.camera_id;
        const location = {
          lat: camera.location.latitude,
          long: camera.location.longitude,
        };
        const model = await Camera.findOneAndUpdate(
          { camera_name: name },
          { location: location },
          {
            new: true,
            upsert: true,
          }
        );

        date = new Date(camera.timestamp);

        let picture = await Picture.findOne({
          date: date,
          camera_id: model.id,
        });

        if (picture != undefined) {
          continue;
        }

        const url = camera.image;

        try{
            const result = await axios.post(
                `http://localhost:8080/detect-url?url=${url}`, 
                {
                  timeout: 3000
                });
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
        }catch(error){
            console.log("Error proccessing an image", error);
        }
        
      }
      console.log(`Done! at ${new Date().toLocaleString()}`)
      return date;
    }
  );

  generateTrafficDataPeriodically.start();
};

export default {initScheduledJobs}