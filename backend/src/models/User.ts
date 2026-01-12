import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
 email: { type: String, required: true, unique: true },
  refreshToken: String, // CRITICAL for background tasks
  activeTopic: String,
  totalDays: Number,
  startDate: Date,
  isSteeringActive: { type: Boolean, default: false },
  lastInjectedAt: { type: Date, default: Date.now }
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
