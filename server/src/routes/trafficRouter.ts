import express, { Request, Response } from 'express';
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// GET request for a list of car counts for each camera
router.get('/', trafficController.getCurrentTrafficCondition);

module.exports = router;