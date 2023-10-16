// Require Mongoose
import mongoose from 'mongoose'

// Define a schema
const Schema = mongoose.Schema;
const ReportSchema = new Schema({
  incident: {
    type: String,
    required: true,
    enum: ["Accident", "RoadWork", "RoadClosure"]
  },
  location: {
    long: { type: Schema.Types.Decimal128, required: true },
    lat: { type: Schema.Types.Decimal128, required: true }
  },
  address: {type: String, required: true},
  duration_hours: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
  reported_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    //required: true
    required: false
  }
});

// Compile model from schema
const Report = mongoose.model("Report", ReportSchema);

// Export model
export default Report;

