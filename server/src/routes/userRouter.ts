import express, { Request, Response } from 'express';
import { auth } from '../middlewares/auth';
const router = express.Router();
const userController = require('../controllers/userController');


// GET request for a list of all users
//router.get('/', userController.getAllUsers);

// GET request for a specific user
router.get('/:userId',userController.getOneUser);

// POST request for registration
router.post('/register', userController.createUser);

// POST request for login
router.post('/login', userController.login);

// POST request to check for active login
router.post('/auth', userController.loggedIn);

// POST request for forget password - Request change password
router.post('/forget-password', userController.forgetPassword);

// POST request for forget password - Change password
// router.post('/forget-password/:userId/:passwordToken', userController.validatePasswordToken);

// PUT request to update user details
router.put('/update-user', userController.updateUser);

// PUT request to update user password
router.put('/update-password', userController.updateUserPassword);

// DELETE request to delete the users
router.delete('/:userId', userController.deleteUser);

module.exports = router;
