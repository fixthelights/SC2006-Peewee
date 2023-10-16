import express, { Request, Response } from 'express';
import { AppError } from '../config/AppError';
import crypto from 'crypto';

const User = require("../models/user");
const PasswordToken = require("../models/passwordToken");
const userRouter = require("../routes/userRouter");
const bcrypt = require("bcrypt");
const { sendForgetEmail } = require("../middlewares/BrevoAPI");

//200 - SUCCESS - Found and sent.

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
    // return res.status(200).send(User.getAll());
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
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;

        
        if (username && password) {
            // Check if user already exists
            if (!!await User.findOne({ username : username })) {
                throw new AppError({
                    type: "UserExistsError",
                    statusCode: 404,
                    description: 'User already exists.',
                });
            }
            // Create a new user instance
            const newUser = new User({ username, password, email, firstName, lastName, phone});

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
        const username = req.body.username;
        const password = req.body.password;

        // If missing username or password
        if (!username || !password) {
            throw new AppError({
                type: "MissingLoginError",
                statusCode: 404,
                description: 'Username/Password is not entered.',
            });
        }

        // If username & password match
        if (await authenticatedUser( username , password )) {
            return res.status(200).send("User successfully logged in");
        } else {
            throw new AppError({
                type: "UserVerificationError",
                statusCode: 404,
                description: 'Username/Password is invalid.',
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

// POST request for forget password - Request change password
exports.forgetPassword = async ( req: Request, res: Response ) => {
    try {
        const username = req.body.username;
        const email = req.body.email;

        
        const verifiedUser = await User.findOne({username : username});
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
                description: 'Email does not match username.',
            });
        }

        let token = await PasswordToken.findOne({ userId: verifiedUser._id });
        if (!token) {
            token = await new PasswordToken({
                userId: verifiedUser._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = req.protocol + "://" + req.get('host') + req.originalUrl + "/" + verifiedUser._id + "/" + token.token;
        console.log(link);
        await sendForgetEmail(verifiedUser, link);

        return res.status(200).send("Password reset link sent to your email account");
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
        const verifiedUser = await User.findById(req.params.userId);
        if (!verifiedUser) {
            throw new AppError({
                type: "InvalidResetTokenError",
                statusCode: 400,
                description: 'Invalid or expired link.',
            });
        }
        const token = await PasswordToken.findOne({
            userId: verifiedUser.userId,
            token: req.params.token,
        });
        if (!token) {
            throw new AppError({
                type: "InvalidResetTokenError",
                statusCode: 400,
                description: 'Invalid or expired link.',
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

// Update a user's information by ID
exports.updateUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.userId;
        const { username, password } = req.body;

        const user = await User.findById({userId : userId});

        if (!user) {
            throw new AppError({
                type: "UserNotFoundError",
                statusCode: 404,
                description: 'User not found.',
            });
        }

        // Update user properties
        user.username = username;
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
        const user = await User.findByIdAndDelete({userId : userId});

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

// // Check if the user exists in our DB
// const userExists = async (username : String) => {    
//     try {
//         const queriedUser = await User.findOne({ username : username });

//         return !!queriedUser; // Returns true if the user exists, false otherwise
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };

// Check if username and password match our DB
const authenticatedUser = async ( username : String, password : String ) => {
    const verifiedUser = await User.findOne({username : username});
    return (verifiedUser.username === username && await verifyPassword(password,verifiedUser.password));
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
