import express, { Request, Response } from 'express';
const router = express.Router();
const routeController = require('../controllers/routeController');

//implement CRUD operations for routes
router.post('/', routeController.createRoutes);
    
    //read all routes(GET):
router.get('/', routeController.findRoutes);
    
    //read specific route(GET by ID):
router.get('/:id', routeController.getRoutes);

//read route list(GET by ID):
router.post('/list', routeController.getUserRoutes);
    
    //update (PUT by ID):
router.put('/:id', routeController.updateRoutes);
    
    //delete(DELETE BY ID)
router.delete('/:id',routeController.deleteRoutes);
    
module.exports = router;