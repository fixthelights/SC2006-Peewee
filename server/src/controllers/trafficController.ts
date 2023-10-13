import express, { Request, Response } from 'express';
import axios from 'axios';
import { AppError } from '../config/AppError';

import Camera from '../models/camera';
import Picture from '../models/picture';
import Trend from '../models/trend';

import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';


exports.getCurrentTrafficCondition = async (req :Request, res :Response) => {
    
    return res.status(200).send();
}