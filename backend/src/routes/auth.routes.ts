import { Router } from "express";
import { googleAuth, googleCallback } from "../controllers/auth.controller";
import userModel from "../models/User";

const router = Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/status/:email", async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  res.json(user); // This returns isSteeringActive, topic, etc.
});
export default router;
