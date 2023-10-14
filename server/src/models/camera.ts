// Require Mongoose
import mongoose, { Decimal128 } from 'mongoose'

// Define a schema
const Schema = mongoose.Schema;
const CameraSchema = new Schema({
  location: {
    long: { type: Schema.Types.Decimal128, required: true, get: getDecimal},
    lat: { type: Schema.Types.Decimal128, required: true, get: getDecimal}
  },
  camera_name: {type: String, required: true}
}, {toObject: {getters: false}, toJSON: {getters: false}});

function getDecimal(value: any) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

// Compile model from schema
const Camera = mongoose.model("Camera", CameraSchema);

// Export model
export default Camera;

