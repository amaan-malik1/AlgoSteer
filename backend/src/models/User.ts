import mongoose from "mongoose";

const SteeringSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  totalDays: { type: Number, default: 7 },
  startDate: { type: Date, default: Date.now },
  lastSync: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  // 🔥 Support for multiple steerings
  steerings: [SteeringSchema]
});

export default mongoose.model("User", UserSchema);