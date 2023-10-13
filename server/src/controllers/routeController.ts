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

exports.findRoutes = async (req:Request, res: Response)=>{
        try {
           const routes = await Route.find();
           res.send(routes);
        } catch(err: any){
           res.status(500).send(err.message);
        }
       }
    
exports.getRoutes =  async(req:Request,res:Response)=>{
        try {
          const route = await Route.findById(req.params.id);
          if(!route) return res.status(404).send('Route not found');
          res.send(route);
        }catch(err : any){
          res.status(500).send(err.message);
        }
      }

exports.updateRoutes = async(req: Request, res: Response) => {
        try {
            const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!route) return res.status(404).send('Route not found');
            res.status(200).send(route);
        } catch(err : any) {
            res.status(400).send(err.message);
        }
    };

exports.deleteRoutes = async (req:Request, res:Response) => {
        try {
            const route = await Route.findByIdAndDelete(req.params.id);
            if (!route) return res.status(404).send('Route not found');
            res.status(204).send();
        } catch (err : any) {
            res.status(500).send(err.message);
        }
    }
