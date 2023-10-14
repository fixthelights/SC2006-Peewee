// Require Mongoose
import mongoose from 'mongoose'

// Define a schema
const Schema = mongoose.Schema;
const CameraSchema = new Schema({
  location: {
    long: { type: Schema.Types.Decimal128, required: true },
    lat: { type: Schema.Types.Decimal128, required: true }
  },
  camera_name: {type: String, required: true}
});

// Compile model from schema
const Camera = mongoose.model("Camera", CameraSchema);

// Export model
export default Camera;

