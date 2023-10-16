import express, { Request, Response } from 'express';
import { auth } from '../middlewares/auth';
const router = express.Router();
const userController = require('../controllers/userController');
// const jwt = require("jwt");
// const session = require('express-session')

// GET request for a list of all users
router.get('/', userController.getAllUsers);

// GET request for a specific user
router.get('/:userId',userController.getOneUser);

// POST request for registration
router.post('/register', userController.createUser);

// POST request for login
router.post('/login', userController.login);

// POST request for forget password - Request change password
router.post('/forget-password', auth, userController.forgetPassword);

// POST request for forget password - Change password
router.post('/forget-password/:userId/:passwordToken', auth, userController.validatePasswordToken);

// PUT request to update user details
router.put('/:userId', auth, userController.updateUser);

// DELETE request to delete the users
router.delete('/:userId', userController.deleteUser);

module.exports = router;
