import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log("Connecting to MongoDB in production mode...");
}

clientPromise.then(() => {
  console.log("MongoDB connected successfully!");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

// Ensure Mongoose uses the same MongoClient connection
clientPromise.then((mongoClient) => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(uri, { ...options, useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false });
  }
});

export default clientPromise;
