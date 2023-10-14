// Require Mongoose
const mongoose = require("mongoose");

//define Mongoose Schema and Model for routes
const routeSchema = new mongoose.Schema({
    source: {
        longitude: Number,
        latitude: Number
    },
    destination: {
        longitude: Number, 
        latitude: Number
    },
    description: String
    });
    const Route = mongoose.model('Route', routeSchema);
    