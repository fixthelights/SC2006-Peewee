import express, { Request, Response } from 'express';
const router = express.Router();
const routeController = require('../controllers/routeController');


//implement CRUD operations for routes
app.post('/', routeController.createRoutes);
    
    //read all routes(GET):
app.get('/routes', async (req, res)=>{
     try {
        const routes = await Route.find();
        res.send(routes);
     } catch(err){
        res.status(500).send(err.message);
     }
    
    });
    
    //read specific route(GET by ID):
    app.get('/routes/:id', async(req,res)=>{
      try {
        const route = await Route.findById(req.params.id);
        if(!route) return res.status(404).send('Route not found');
        res.send(route);
      }catch(err){
        res.status(500).send(err.message);
      }
    });
    
    //update (PUT by ID):
    app.put('/routes/:id', async(req, res)=> {
      try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) return res.status(404).send('Route not found');
      } catch(err){
        res.status(400).send(err.message);
      }
    });
    
    //delete(DELETE BY ID)
    app.delete('/routes/:id', async (req, res) => {
        try {
            const route = await Route.findByIdAndDelete(req.params.id);
            if (!route) return res.status(404).send('Route not found');
            res.status(204).send();
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
    