// Require Mongoose
const mongoose = require("mongoose");

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
  duration_hours: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() }
});

// Compile model from schema
const Report = mongoose.model("Report", ReportSchema);

// Export model
module.exports = Report;

