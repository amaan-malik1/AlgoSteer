import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import youtubeRoute from "./routes/youtube.routes";
import connectDB from "./config/db";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

// Routes (We will create these next)
app.use("/api/auth", authRouter);
app.use("/api/youtube", youtubeRoute);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
