import express, { Request, Response } from 'express';
import { connectDB } from './src/config/mongo';
import { errorHandler } from './src/middlewares/errorHandler';
import { AppError } from './src/config/AppError';

// Connect to MongoDB
connectDB();

// Add async error handling
import 'express-async-errors';


// Import Express Routers
const userRouter = require('./src/routes/userRouter');
const reportRouter = require('./src/routes/reportRouter');
//const routeRouter = require('./src/routes./routeRouter');
 
// Import User Object
const User = './src/models/user'

// Express Code
const app = express();
const port = process.env.PORT || 2000;
app.use(express.json());

// Define API Routes
app.use('/users',userRouter);
app.use('/reports',reportRouter);
//app.use('/routes',routeRouter);


// Catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
    throw new AppError({statusCode: 404, description: `Endpoint ${req.url} Not Found!`});
});

// error handler
app.use(errorHandler);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});