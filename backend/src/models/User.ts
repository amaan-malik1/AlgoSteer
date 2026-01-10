import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  focusTopic: String,
  dayLeft: Number,
  startDate: { type: Date, default: Date.now },
});

export const userModel = mongoose.model("User", UserSchema);
