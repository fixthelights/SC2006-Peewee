import express, { Request, Response } from 'express';
const router = express.Router();
const userController = require('../controllers/userController');
// const jwt = require("jwt");
// const session = require('express-session')

// GET request for a list of all users
router.get('/', userController.getAllUsers);

// GET request for a specific student
router.get('/:userId',userController.getOneUser);

// POST request for registration
router.post('/register', userController.createUser);

// POST request for login
router.post('/login', userController.login);

// POST request for forget password - Request change password
router.post('/forget-password', userController.forgetPassword);

// POST request for forget password - Change password
router.post('/forget-password/:userId/:passwordToken', userController.validatePasswordToken);

// PUT request to update student details
router.put('/:userId', userController.updateUser);

// DELETE request to delete the students
router.delete('/:userId', userController.deleteUser);

module.exports = router;