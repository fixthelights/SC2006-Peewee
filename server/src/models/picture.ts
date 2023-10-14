// Require Mongoose
import mongoose from 'mongoose'

// Define a schema
const Schema = mongoose.Schema;
const PictureSchema = new Schema({
    date: {
        required: true,
        type: Date
    },
    vehicle_count: { type: Number, required:true },
    url: { type: String, required: true},
    camera_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Camera"
    }
});

// Compile model from schema
const Picture = mongoose.model("Picture", PictureSchema);

// Export model
export default Picture;

