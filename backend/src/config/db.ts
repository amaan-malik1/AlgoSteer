import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/algoSteer";

const connectDB = async () => {
  try {
    await mongoose.connect(MongoUrl as string);
    console.log("MongoDb connected");
  } catch (error) {
    console.error("Error while connecting MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
