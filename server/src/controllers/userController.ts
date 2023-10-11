import express, { Request, Response } from 'express';
const userRouter = require("../routes/userRouter")
const User = require("../models/user")

//200 - SUCCESS - Found and sent.


exports.getAllUsers = async (req :Request, res :Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    // return res.status(200).send(User.getAll());
};

exports.getOneUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    // return res.status(200).send(User.getOne(1));
};

exports.createUser = async (req :Request, res :Response) => {
    try{ 
        const { username, password } = req.body;
        const newUser = new userRouter({ username, password });
        await newUser.save();
        res.status(201).send("User registered successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.")
    }
};

// Update a user's information by ID
exports.updateUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user properties
        user.username = username;
        user.password = password;

        // Save the updated user to the database
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
  }
    // return res.status(200).send();
};

// Delete a user by ID
exports.deleteUser = async (req :Request, res :Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    // return res.status(200).send();
};