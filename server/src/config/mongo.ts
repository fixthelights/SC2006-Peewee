const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const MONGO_URI = "mongodb://localhost/peewee";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://localhost:27017/peewee`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1)
  }
}

export { connectDB };