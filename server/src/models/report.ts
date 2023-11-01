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
    long: { type: Schema.Types.Decimal128, required: true, get: getDecimal},
    lat: { type: Schema.Types.Decimal128, required: true, get: getDecimal}
  },
  address: {type: String, required: true},
  description: { type: String, required: true },
  time : {type: String, required: true},
  date : {type: String, required: true},
  reported_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    //required: true
    required: false
  }
}, {toObject :{getters: true}, toJSON :{getters: true}});

function getDecimal(value: any) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

// Compile model from schema
const Report = mongoose.model("Report", ReportSchema);

// Export model
export default Report;

