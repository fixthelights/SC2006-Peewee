const mongoose = require("mongoose");

// Get environmental configurations
require('dotenv').config()
const MONGO_HOST = process.env.MONGO_HOST || "localhost";  //Default "localhost"
const MONGO_PORT = process.env.MONGO_PORT || "27017"; //Default "27017"
const MONGO_DB = process.env.MONGO_DB || "peewee"; //Default "peewee"
const MONGO_TLS = process.env.MONGO_TLS;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_AUTH = MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : "";

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const MONGO_URI = `mongodb://${MONGO_AUTH}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: (MONGO_TLS === 'TRUE' ? true : false)
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Error connecting to MongoDB!', error);
    process.exit(1)
  }
}

export { connectDB };