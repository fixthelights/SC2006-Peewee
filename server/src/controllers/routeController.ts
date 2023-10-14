import express, { Request, Response } from 'express';
const mongoose = require("mongoose");
const Route = require("../models/route")


exports.createRoutes = async(req: Request, res: Response)=>{
    const route = new Route(req.body);
    try{
        const savedRoute = await route.save();
        res.status(201).send(savedRoute);
    } catch(err: any){
        res.status(400).send(err.message);
    }
    }

    
