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

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("No code provided");

  try {
    const { tokens } = await oAuth2Client.getToken(code as string);
    oAuth2Client.setCredentials(tokens);

    const oAuth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const userInfo = await oAuth2.userinfo.get();
    const email = userInfo.data.email;

    await userModel.findOneAndUpdate(
      { email },
      {
        email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token, // Saved for the 10-min pulse
      },
      { upsert: true }
    );

    // ✅ Only ONE response: The Redirect
    const frontendUrl = `http://localhost:5173/dashboard?token=${tokens.access_token}&email=${email}`;
    return res.redirect(frontendUrl);
  } catch (error) {
    console.error("Auth Error:", error);
    return res.redirect("http://localhost:5173/?error=auth_failed");
  }
};

// GET STATUS - Added param handling for the dashboard fetch
export const getUserStatus = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// STOP STEERING - To kill the pulse engine
export const stopSteer = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await userModel.findOneAndUpdate({ email }, { isSteeringActive: false });
    res.json({ success: true, message: "Pulse engine stopped." });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop" });
  }
};
