import express, { Request, Response } from 'express';
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// GET request for a list of car counts for each camera
router.get('/conditions/', trafficController.getTrafficConditionsAllCameras);

// GET request for a list of car counts for one camera
router.get('/conditions/:cameraId', trafficController.getTrafficConditionsOneCamera);

// GET request for a collated list of car counts across all cameras
//router.get('/conditions/collated', trafficController);

// PUT request to generate trends on the current day, and overwrite existing trends
router.put('/trends/', trafficController.generateTrends);

// GET request for traffic trends on all cameras
router.get('/trends/', trafficController.getTrendsAllCameras);

// GET request for traffic trends on one camera
//router.get('/trends/:cameraId', trafficController);

// GET request for collated traffic trends across all cameras
//router.get('/collated-trends', trafficController);


module.exports = router;