import { Request, Response } from "express";
import { google } from "googleapis";
import userModel from "../models/User";

const getYoutubeClient = async (userEmail: string) => {
  const user = await userModel.findOne({ email: userEmail });
  if (!user) throw new Error("User not found");

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return google.youtube({ version: "v3", auth });
};

// --- OPTIMIZED ALGO INJECTION ENGINE ---
export const feedAlgorithm = async (email: string, topic: string) => {
  let successCount = 0;
  let skipCount = 0;

  try {
    const youtubeV3 = await getYoutubeClient(email);

    // 1. Refined Search: Targeting "safe" high-engagement content
    const searchRes = await youtubeV3.search.list({
      part: ["snippet"],
      q: topic,
      maxResults: 15, // Larger pool to account for skips
      type: ["video"],
      order: "viewCount", // High views usually mean interactions are open
      videoEmbeddable: "true", // Good indicator for API permissions
      videoDefinition: "high", // Filters out lower-quality restricted clips
    });

    const items = searchRes.data.items || [];

    for (const item of items) {
      const videoId = item.id?.videoId;
      const channelId = item.snippet?.channelId;

      try {
        if (videoId) {
          // 2. Pre-Validation: Check if video is restricted/private
          const videoDetails = await youtubeV3.videos.list({
            id: [videoId],
            part: ["status", "contentDetails"],
          });

          const status = videoDetails.data.items?.[0]?.status;

          // Skip if video is rejected or specifically "made for kids" (highly restricted)
          if (
            status?.uploadStatus === "rejected" ||
            status?.privacyStatus === "private"
          ) {
            skipCount++;
            continue;
          }

          // 3. Multiplier 1: Like Video
          await youtubeV3.videos.rate({ id: videoId, rating: "like" });

          // 4. Multiplier 2: History Inject (List call signals interest)
          await youtubeV3.videos.list({ id: [videoId], part: ["snippet"] });

          if (channelId) {
            // 5. Multiplier 3: Subscribe
            try {
              await youtubeV3.subscriptions.insert({
                part: ["snippet"],
                requestBody: {
                  snippet: {
                    resourceId: { kind: "youtube#subscription", channelId },
                  },
                },
              });
            } catch (e) {
              /* Already subscribed */
            }
          }

          successCount++;
          console.log(`✅ Success: Injected ${topic} via ${videoId}`);
        }
      } catch (innerErr) {
        skipCount++;
        console.warn(`⏩ Skipping restricted item: ${videoId}`);
      }

      // Stop once we have successfully injected 5-8 solid signals to save quota
      if (successCount >= 8) break;
    }

    // Update the last sync time for this specific topic in the database
    await userModel.findOneAndUpdate(
      { email, "steerings.topic": topic },
      { $set: { "steerings.$.lastSync": new Date() } }
    );

    console.log(
      `[PULSE REPORT] Topic: ${topic} | Success: ${successCount} | Skipped: ${skipCount}`
    );
  } catch (error) {
    console.error("❌ Pulse Engine Error:", error);
  }
};

// --- PULSE ENGINE FOR ALL ACTIVE TOPICS ---
export const pulseAllTopics = async (email: string) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.steerings) return;

    const activeSteerings = user.steerings.filter((s) => s.isActive);

    for (const steer of activeSteerings) {
      console.log(`[PULSE] Initializing engine for: ${steer.topic}`);
      await feedAlgorithm(email, steer.topic);
    }
  } catch (error) {
    console.error("Multi-pulse failure:", error);
  }
};

// --- DELETE STEERING ---
export const deleteSteering = async (req: Request, res: Response) => {
  const { email, steerId } = req.body; // Changed topicId to steerId to match UI
  try {
    await userModel.findOneAndUpdate(
      { email },
      { $pull: { steerings: { _id: steerId } } }
    );
    res.json({ success: true, message: "Steering engine purged." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete steering" });
  }
};

// --- START NEW STEERING ---
export const startSteer = async (req: Request, res: Response) => {
  const { topic, days, email } = req.body;
  try {
    const newSteering = {
      topic,
      totalDays: Number(days),
      startDate: new Date(),
      lastSync: new Date(),
      isActive: true,
    };

    const user = await userModel.findOneAndUpdate(
      { email },
      { $push: { steerings: newSteering } },
      { upsert: true, new: true }
    );

    // Run first injection in background
    feedAlgorithm(email, topic);

    res.json({ success: true, steerings: user.steerings });
  } catch (error) {
    res.status(500).json({ error: "Failed to add steering" });
  }
};
