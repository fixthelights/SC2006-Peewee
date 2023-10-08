import express, { Request, Response } from 'express';
import { connectDB } from './src/config/mongo';

// Connect to MongoDB
connectDB();

// Import Express Routers
const userRouter = require('./src/routes/userRouter');
const reportRouter = require('./src/routes/reportRouter');
 
// Express Code
const app = express();
const port = process.env.PORT || 2000;
app.use(express.json());

app.use('/users',userRouter);
app.use('/reports',reportRouter);
//app.use('/routes',routesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});