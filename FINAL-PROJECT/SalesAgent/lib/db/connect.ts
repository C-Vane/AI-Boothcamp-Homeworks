import mongoose, { Mongoose } from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

const MONGODB_URI: string = process.env.MONGODB_URI;

let dbClient: Mongoose | null = null;

// For Mongoose ORM connections
async function dbConnect() {
  if (dbClient) {
    return dbClient;
  }

  try {
    dbClient = await mongoose.connect(MONGODB_URI);
  } catch (e) {
    dbClient = null;
    throw e;
  }

  return dbClient;
}

export default dbConnect;
