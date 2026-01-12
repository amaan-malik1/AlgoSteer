import { google } from "googleapis";
import dotenv from "dotenv";
import { Request, Response } from "express";
import userModel from "../models/User";

dotenv.config();
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

//controlleer for authentication using google and taking scope(permissions)
export const googleAuth = async (req: Request, res: Response) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "profile",
      "email",
    ],
    prompt: "consent",
  });

  res.redirect(url);
};

// Callback route after user logs in
export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("No code provided by Google");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code as string);
    const frontendUrl = `http://localhost:5173/dashboard?token=${tokens.access_token}`;
    res.redirect(frontendUrl);

    // oAuth2Client.setCredentials(tokens); // for the testing

    res.json({
      message: "Login Suceed",
      tokens,
    });
  } catch (error) {
    console.error("Error exchanging code: ", error);
    res.redirect("http://localhost:5173/login?error=auth_failed");
  }
};

//get  useer status
export const getUserStatus = async (req: Request, res: Response) => {
  const { email } = req.query;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    res.status(200).json({
      isSteeringActive: user.isSteeringActive,
      activeTopic: user.activeTopic,
      startDate: user.startDate,
      totalDays: user.totalDays,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
