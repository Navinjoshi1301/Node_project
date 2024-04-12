import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB Connected to HOST! ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MONGODB Connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
