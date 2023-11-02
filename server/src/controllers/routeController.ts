import express, { Request, Response } from 'express';
import{AppError} from "../config/AppError";
import Route from "../models/route";

exports.createRoutes = async (req: Request, res: Response) => {
    const route = new Route(req.body);
    try {
        const savedRoute = await route.save();
        res.status(201).send(savedRoute);
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 400,
            description: err.message
        });
    }
};

exports.findRoutes = async (req: Request, res: Response) => {
    try {
        const routes = await Route.find();
        res.send(routes);
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 500,
            description: "Error fetching routes!"
        });
    }
};

export const getRoutes = async (req: Request, res: Response) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) throw new AppError({
            statusCode: 404,
            description: 'Route not found'
        });
        res.send(route);
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 500,
            description: "Error fetching the route!"
        });
    }
};

export const getUserRoutes = async (req: Request, res: Response) => {

    try {
        const routeList = await Route.find({ favourited_by : req.body.id}, {favourited_by : false})
        res.send(routeList);
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 500,
            description: "Error fetching the route!"
        });
    }
};

export const updateRoutes = async (req: Request, res: Response) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!route) throw new AppError({
            statusCode: 404,
            description: 'Route not found'
        });
        res.status(200).send(route);
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 400,
            description: "Error updating the route!"
        });
    }
};

export const deleteRoutes = async (req: Request, res: Response) => {
    try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) throw new AppError({
            statusCode: 404,
            description: 'Route not found'
        });
        res.status(204).send();
    } catch (err: any) {
        throw new AppError({
            error: err,
            statusCode: 500,
            description: "Error deleting the route!"
        });
    }
};
