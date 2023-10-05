import express, { Request, Response } from 'express';
const router = express.Router();
const userController = require('../controllers/userController');

// GET request for a list of all users
router.get('/', userController.getAllUsers);

// GET request for a specific student
router.get('/:userId',userController.getOneUser);

// POST request for registration
router.post('/register', userController.createUser);

// PUT request to update student details
router.put('/:userId', userController.updateUser);

// DELETE request to delete the students
router.delete('/:userId', userController.deleteUser);

module.exports = router;
