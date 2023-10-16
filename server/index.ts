import express, { Request, Response} from 'express';
import { connectDB } from './src/config/mongo';
import { errorHandler } from './src/middlewares/errorHandler';
import { AppError } from './src/config/AppError';
require('dotenv').config();


// Connect to MongoDB
connectDB();

// Add async error handling
import 'express-async-errors';

// Run Scheduled Jobs every X minute (AI Traffic Image Processing)
import scheduledFunctions from './src/cardetector/processingTasks';
process.env.PROCESSING === 'TRUE' && scheduledFunctions.initScheduledJobs();


// Import Express Routers
const userRouter = require('./src/routes/userRouter');
const reportRouter = require('./src/routes/reportRouter');
const trafficRouter = require('./src/routes/trafficRouter');
// const routeRouter = require('./src/routes./routeRouter');

// Express Code
const app = express();
const cors = require('cors');
const port = process.env.PORT || 2000;
app.use(express.json());
app.use(cors());

// Define API Routes
app.use('/users',userRouter);
app.use('/reports',reportRouter);
app.use('/traffic-condition', trafficRouter);
// app.use('/routes',routeRouter);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
    throw new AppError({statusCode: 404, description: `Endpoint ${req.url} Not Found!`});
});

// error handler
app.use(errorHandler);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});