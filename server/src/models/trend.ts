// Require Mongoose
import mongoose from 'mongoose'

// Define a schema
const Schema = mongoose.Schema;
const TrendSchema = new Schema({
  location: {
    long: { type: Schema.Types.Decimal128, required: true, get: getDecimal},
    lat: { type: Schema.Types.Decimal128, required: true, get: getDecimal}
  },
  camera_id: {type: String, required: true},
  hourly_counts: [
    {
      _id: false,
      time_of_day: {type: Number, required: true, min: 0, max: 23},
      vehicle_count: {type: Number, required: true},
    }
  ],
  last_updated: {type: Date, default: Date.now()}
}, {id: false, toObject :{getters: true}, toJSON :{getters: true}});

function getDecimal(value: any) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

// Compile model from schema
const Trend = mongoose.model("Trend", TrendSchema);

// Export model
export default Trend;

