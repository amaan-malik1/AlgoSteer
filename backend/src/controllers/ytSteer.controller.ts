import { Request, Response } from "express";
import { google, youtube_v3 } from "googleapis";

const getYoutubeClient = (token: any) => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({ access_token: token });

  return google.youtube({ version: "v3", auth: "" });
};

export const startSteer = async (req: Request, res: Response) => {
  const { token, topic, days } = req.body;
  const youtubeV3 = getYoutubeClient(token);
  try {
    // Search for top 10 videos on the topicbasedon the (viewCount)
    const searchRes = await youtubeV3.search.list({
      part: ["snippet"],
      q: topic,
      maxResults: 10, // no of results
      type: ["video"],
      order: "viewCount",
      relevanceLanguage: "en",
    });

    const items = searchRes.data.items || [];
    const videoIds = items
      .map((item) => item.id?.videoId)
      .filter((id): id is string => !!id);

    //creating focus playlist
    const playlist = await youtubeV3.playlists.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: `AlgoSteer: ${topic}`,
          description: `Day 1 of ${days}`,
        },
        status: { privacyStatus: "private" },
      },
    });

    const playlistId = playlist.data.id;

    for (const id of videoIds) {
      await youtubeV3.videos.rate({
        id: id,
        rating: "like",
      });

      // ADD to Playlist
      await youtubeV3.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId: playlistId,
            resourceId: { kind: "youtube#video", videoId: id },
          },
        },
      });

      res.json({
        success: true,
        message: `Algo steered to ${topic}. Playlist created!`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to manipulate feed" });
  }
};
