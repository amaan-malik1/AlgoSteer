import express from "express";
import { startSteer } from "../controllers/ytSteer.controller";

const router = express.Router();

router.post("/steer", startSteer);

export default router;
