import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error("Please define the mongodb url in the environment");
}

// Connect to DataBase

const connectToDataBase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database Connected!!!");
  } catch (err) {
    console.log(`Error is ${err}`);
  }
};

export default connectToDataBase;
