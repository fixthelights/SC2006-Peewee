import express, { Request, Response } from 'express';
import { AppError } from '../config/AppError';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { signToken, authJwt } from '../middlewares/auth';


const User = require("../models/user");
const PasswordToken = require("../models/passwordToken");
const userRouter = require("../routes/userRouter");
const bcrypt = require("bcrypt");
const { sendForgetEmail } = require("../middlewares/BrevoAPI");

exports.getAllUsers = async (req :Request, res :Response) => {
    try {
        const users = await User.find();
        return res.json(users);
    }catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "GetAllUsersError",
            statusCode: 500,
            description: 'Error loading users.',
            error: error
        });
    }
};

exports.getOneUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById({userId : userId});

        if (!user) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }

        res.json(user);
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "GetUserError",
            statusCode: 500,
            description: 'Error getting user.',
            error: error
        });
    }
    return res.status(200).send(User.findOne(1));
};

// Create user with POST request
exports.createUser = async (req :Request, res :Response) => {
    try{ 
        const password = req.body.password;
        const email = req.body.email.toLowerCase();
        
        if (email && password) {
            // Check if user already exists
            if (!!await User.findOne({ email : email })) {
                throw new AppError({
                    type: "UserExistsError",
                    statusCode: 404,
                    description: 'User already exists.',
                });
            }
            // Create a new user instance
            const newUser = new User({ email, password});

            // Save the new user to the database
            await newUser.save();

            res.status(201).send("User registered successfully");
        }
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "CreateUserError",
            statusCode: 500,
            description: 'Error creating account.',
            error: error
        });
    }
};


// Login with POST request
exports.login = async (req : Request,res : Response) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        // If missing email or password
        if (!email || !password) {
            throw new AppError({
                type: "MissingLoginError",
                statusCode: 404,
                description: 'Email/Password is not entered.',
            });
        }

        // If email & password match
        const verifiedUser = await authenticatedUser( email , password )
        if (verifiedUser) {
            const token = signToken(verifiedUser._id, verifiedUser.email);

            console.log("User logged in successfully");
            return res.status(200).json( {_id: verifiedUser._id, email: email, token: token} ); // Returns JWT for frontend to store
        } else {
            throw new AppError({
                type: "UserVerificationError",
                statusCode: 404,
                description: 'Email/Password is invalid.',
            });
        }
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "LoginError",
            statusCode: 500,
            description: 'Error loggin in.',
            error: error
        });
    }
};

// POST request to check if user is logged in
exports.loggedIn = async (req : Request,res : Response) => {
    res.json(authJwt(req.body.jwt));
};

// POST request for forget password - Request change password
exports.forgetPassword =  async ( req: Request, res: Response ) => {
    try {
        const email = req.body.email.toLowerCase();
        
        const verifiedUser = await User.findOne({email : email});
        if (!verifiedUser) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }
        if (verifiedUser.email !== email) {
            throw new AppError({
                type: "UserVerificationError",
                statusCode: 404,
                description: 'Email does not match email.',
            });
        }
        
        // Delete existing password token and create a new one
        let token = await PasswordToken.findOne({ userId: verifiedUser._id });
        if (token) {
            PasswordToken.findByIdAndDelete({userId: verifiedUser._id });
        }
        // Generate 6 digit OTP for password reset token
        token = await new PasswordToken({
            userId: verifiedUser._id,
            token: generateOTP(6),
        }).save();

        // Send email to user with OTP
        await sendForgetEmail(verifiedUser, token.token);

        return res.status(200).json({otp: token, message:"Password reset code sent to your email account"});
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "ForgetPasswordError",
            statusCode: 500,
            description: 'Error validating user.',
            error: error
        });
    }
};


// POST request for forget password - Change password
exports.validatePasswordToken = async (req: Request, res: Response) => {
    try {
        // Get user by searching with email
        const verifiedUser = await User.findOne({email: req.body.email});

        // Search for active password reset token
        const token = await PasswordToken.findOne({
            userId: verifiedUser.userId,
            token: req.params.token,
        });

        if (!token) {
            throw new AppError({
                type: "InvalidResetTokenError",
                statusCode: 400,
                description: 'Invalid or expired OTP.',
            });
        }
        
        verifiedUser.password = req.body.password;
        await verifiedUser.save();
        await token.delete();

        return res.status(200).send("Password reset sucessfully");
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "PasswordTokenValidationError",
            statusCode: 500,
            description: 'Error validating password reset token.',
            error: error
        });
        
    }
};

// PUT request to update a user's information by email
exports.updateUserPassword = async (req :Request, res :Response) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const user = await User.findOne({email : email});
        if (!user) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }

        // Update user password
        user.password = password;

        // Save the updated user to the database
        await user.save();
        return res.status(200).send("User's password has been updated");
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "UpdateUserError",
            statusCode: 500,
            description: 'Error updating password.',
            error: error
        });
    }
    
};


// Update a user's information by ID
exports.updateUser = async (req :Request, res :Response) => {
    try {
        const userId = req.body._id;
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const user = await User.findById({_id : userId});

        if (!user) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }

        // Update user properties
        user.email = email;
        user.password = password;

        // Save the updated user to the database
        await user.save();

        res.json(user);
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "UpdateUserError",
            statusCode: 500,
            description: 'Error updating user.',
            error: error
        });
    }
    return res.status(200).send("User's information has been updated");
};

// Delete a user by ID
exports.deleteUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete({_id : userId});

        if (!user) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }

        res.json(user);
    } catch(error: any){
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "DeleteUserError",
            statusCode: 500,
            description: 'Error deleting user.',
            error: error
        });
    }
    return res.status(200).send("User has been deleted");
};



////////////////// Helper functions //////////////////

// Check if email and password match our DB
const authenticatedUser = async ( email : String, password : String ) => {
    const verifiedUser = await User.findOne({email : email});
    return (verifiedUser.email === email && await verifyPassword(password,verifiedUser.password))? verifiedUser : false;
}

// Verifying Password during Login
const verifyPassword = async (inputPassword : String, hashedPassword : String) => {
    try {    
        const match = await bcrypt.compare(inputPassword, hashedPassword);
        return match; // Returns true if the passwords match, false otherwise
    } catch(error : any) {
        throw new AppError({
            type: "PasswordVerificationError",
            statusCode: 500,
            description: 'Error deleting user.',
            error: error
        });
    };
};

const generateOTP = (otpLen: number) => {
    const permissableCharacters = '0123456789';
    let OTP = '';
    for (let i = 0; i < otpLen; i++) {
        OTP += permissableCharacters[Math.floor(Math.random() * permissableCharacters.length)];
    }
    return OTP;
}
