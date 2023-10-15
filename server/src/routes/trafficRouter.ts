import express, { Request, Response } from 'express';
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// GET request for a list of latest consolidated vehicle counts across all cameras
router.get('/combined-conditions/', trafficController.getConsolidatedTrafficConditions);

// GET request for a list of latest vehicle counts for all cameras
router.get('/conditions/', trafficController.getTrafficConditionsAllCameras);

// GET request for a list of latest vehicle counts for one camera
router.get('/conditions/:cameraId', trafficController.getTrafficConditionsOneCamera);


// GET request for consolidated traffic trends across all cameras
router.get('/combined-trends/', trafficController.getConsolidatedTrends);

// GET request for traffic trends on one camera
router.get('/trends/:cameraId', trafficController.getTrendsOneCamera);

// PUT request to generate trends on the current day, and overwrite existing trends
router.put('/trends/', trafficController.generateTrends);

module.exports = router;