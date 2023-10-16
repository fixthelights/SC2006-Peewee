import express, { Request, Response } from 'express';
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET request for a list of all incident reports
router.get('/', reportController.getAllReports);

// GET request for a specific report
router.get('/:reportId',reportController.getOneReport);

// GET request for the current day's report
router.get('/all/today', reportController.getTodayReports);

// POST request to submit a new report
router.post('/', reportController.submitReport);

// PUT request to update a report
router.put('/:reportId', reportController.updateReport);

// DELETE request to delete a report
router.delete('/:reportId', reportController.deleteReport);

module.exports = router;