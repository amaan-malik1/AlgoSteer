import { Request, Response } from "express";
import { google } from "googleapis";
import userModel from "../models/User";

const getYoutubeClient = (token: string) => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ access_token: token });
  return google.youtube({ version: "v3", auth });
};

export const startSteer = async (req: Request, res: Response) => {
  const { token, topic, days, email } = req.body;
  const youtubeV3 = getYoutubeClient(token);

  try {
    const searchRes = await youtubeV3.search.list({
      part: ["snippet"],
      q: topic,
      maxResults: 10,
      type: ["video"],
      order: "viewCount",
    });

    const videoIds = searchRes.data.items?.map((item) => item.id?.videoId).filter(Boolean) || [];

    const playlist = await youtubeV3.playlists.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title: `AlgoSteer: ${topic}`, description: `Focus: ${days} days` },
        status: { privacyStatus: "private" },
      },
    });

    const playlistId = playlist.data.id;

    for (const id of videoIds) {
      await youtubeV3.videos.rate({ id: id as string, rating: "like" });
      await youtubeV3.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId,
            resourceId: { kind: "youtube#video", videoId: id as string },
          },
        },
      });
    }

    await userModel.findOneAndUpdate(
      { email },
      { activeTopic: topic, totalDays: Number(days), startDate: new Date(), isSteeringActive: true },
      { upsert: true }
    );

    res.json({ success: true, message: "Algorithm Re-trained!" });
  } catch (error) {
    res.status(500).json({ error: "API limit or Auth error" });
  }
};