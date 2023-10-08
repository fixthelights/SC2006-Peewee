import express, { Request, Response } from 'express';
const mongoose = require("mongoose");
const Report = require("../models/report")

//200 - SUCCESS - Found and sent.

exports.getAllReports = async (req :Request, res :Response) => {
    const reports = await Report.find().exec()
    return res.status(200).send(reports);
}

exports.getOneReport = async (req :Request, res :Response) => {

    const id = req.params.reportId;
    if(!id){ // Check for empty id
        return res.status(400).send();
    }

    try{
        const report = await Report.findOne({ _id: id});
        return res.status(200).send(report);
    }catch(error: any){
        return res.status(404).send(error);
    }    
}

exports.submitReport = async (req :Request, res :Response) => {
    const json = req.body; // Extract JSON from Request body

    const report = new Report;
    report.incident = json.incident;
    report.location = json.location;
    report.duration_hours = json.duration_hours;
    report.description = json.description;

    try{
        await report.save()
    }catch(error: any){
        console.log(error);
        throw new Error("Unable to save report")
    }
    return res.status(200).send();
}

exports.updateReport = (req :Request, res :Response) => {
    return res.status(200).send();
}

exports.deleteReport = (req :Request, res :Response) => {
    return res.status(200).send();
}