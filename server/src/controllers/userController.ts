import express, { Request, Response } from 'express';
const User = require("../models/user")

//200 - SUCCESS - Found and sent.


exports.getAllUsers = (req :Request, res :Response) => {
    return res.status(200).send(User.getAll());
}

exports.getOneUser = (req :Request, res :Response) => {
    return res.status(200).send(User.getOne(1));
}

exports.createUser = (req :Request, res :Response) => {
    return res.status(200).send();
}

exports.updateUser = (req :Request, res :Response) => {
    return res.status(200).send();
}

exports.deleteUser = (req :Request, res :Response) => {
    return res.status(200).send();
}