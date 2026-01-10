import { google } from "googleapis";
import dotenv from "dotenv";
import { Request, Response } from "express";

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
  const { code } = req.body;
  try {
    const token = await oAuth2Client.getToken(code);

    res.json({
      message: "Login Suceed",
      token,
    });
  } catch (error) {
    res.status(500).send("Authentication failed while login");
  }
};
