// Require Mongoose
const mongoose = require("mongoose");

//define Mongoose Schema and Model for routes
const routeSchema = new mongoose.Schema({
    source: {
        longitude: Number,
        latitude: Number,
        address: String 
    },
    destination: {
        longitude: Number, 
        latitude: Number,
        address: String
    },
    description: String
    });

    const Route = mongoose.model('Route', routeSchema);
    
    export default Route;