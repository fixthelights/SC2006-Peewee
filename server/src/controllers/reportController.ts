import { Request, Response } from 'express';
import { AppError } from '../config/AppError';
import Report from '../models/report';

exports.getAllReports = async (req :Request, res :Response) => {
    try{
        const reports = await Report.find();
        return res.status(200).send(reports)
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error loading reports.',
            error: error
        });
    }
}

exports.getOneReport = async (req :Request, res :Response) => {
    // Extract ID from URL
    const id = req.params.reportId;

    try{
        const report = await Report.findOne({ _id: id});
        return res.status(200).send(report);
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error loading report.',
            error: error
        });
    }
}

exports.getTodayReports = async (req :Request, res :Response) => {
    try{
        const date = new Date()
        const reports = await Report.find({date : date.toDateString()});
        return res.status(200).send(reports);
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error loading report.',
            error: error
        });
    }
}

exports.getRecentReports = async (req :Request, res :Response) => {
    try{
        const date = new Date()
        const reports = await Report.find({date : date.toDateString()});
        if (reports.length<=3){
            return res.status(200).send(reports);
        } else {
            return res.status(200).send(reports.slice(-3));
        }
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error loading report.',
            error: error
        });
    }
}

exports.submitReport = async (req :Request, res :Response) => {
    // Extract fields from JSON Request body
    const json = req.body; 

    const report = new Report;
    report.incident = json.incident;
    report.location = json.location;
    report.address = json.address;
    report.time = json.time;
    report.date = json.date;
    report.description = json.description;

    try{
        await report.save()
        return res.status(200).send();
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error submitting report.',
            error: error
        });
    }
    
}

// API allows update to all report fields
// Fields are optional, at least 1 field is required. 
/*
    For example, this request json is valid.
    {
        "duration_hours": 12,
        "description": "Accident at Jurong West St 64"
    }
*/
exports.updateReport = async (req :Request, res :Response) => {
    // Extract ID from URL
    const id = req.params.reportId;

    // Extract fields from JSON Request body
    const json = req.body;

    if(Object.keys(json).length == 0){
        throw new AppError({
            type: "RequestError",
            statusCode: 400,
            description: 'Empty json in request body!'
        });
    }

    try{
        const report = await Report.findOneAndUpdate({_id:id}, json, { new: true })
        return res.status(200).send(report);
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Unable to save reports.',
            error: error
        });
    }
}

exports.deleteReport = async (req :Request, res :Response) => {
    // Extract ID from URL
    const id = req.params.reportId;
    
    try{
        const report = await Report.findOneAndDelete({ _id: id});
        return res.status(200).send(report);
    }catch(error: any){
        throw new AppError({
            type: "Error",
            statusCode: 500,
            description: 'Error deleting reports.',
            error: error
        });
    }
}