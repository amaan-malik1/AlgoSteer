import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import authRoutes from "./routes/auth.routes.js";
import focusRoutes from "./routes/focus.routes.js";

import "./config/passport.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/focus", focusRoutes);

export default app;
