import mongoose from 'mongoose'
const Schema = mongoose.Schema;

//define Mongoose Schema and Model for routes
const routeSchema = new mongoose.Schema({
    favourited_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    source: {
        longitude: Number,
        latitude: Number,
        address: String
    },
    destination: {
        longitude: Number, 
        latitude: Number,
        address: String
    }
});

const Route = mongoose.model('Route', routeSchema);
    
export default Route;