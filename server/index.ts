import express, { Request, Response } from 'express';
import db from './src/db'

// Import Express Routers
const userRouter = require('./src/routes/userRouter');
const User = './src/models/user'

// Express Code
const app = express();
const port = process.env.PORT || 2000;

app.use('/users',userRouter);
//app.use('/incidents',incidentsRouter);
//app.use('/routes',routesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});


app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});