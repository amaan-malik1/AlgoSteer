import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import VideoCard from "../components/VideoCard";

const Setup = () => {
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState(7);
  const [videos, setVideos] = useState([]);

  const fetchPreview = async () => {
    const res = await fetch("http://localhost:5000/api/focus/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setVideos(data.videos);
  };

  const startSteering = async () => {
    await fetch("http://localhost:5000/api/focus/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, days }),
    });
    window.location.href = "/dashboard";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Set Your Focus Goal</h2>

        <input
          className="w-full p-3 bg-gray-900 rounded mb-4"
          placeholder="What do you want to learn?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 bg-gray-900 rounded mb-6"
          placeholder="How many days?"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <div className="flex gap-4 mb-8">
          <Button onClick={fetchPreview}>Preview Videos</Button>
          <Button onClick={startSteering}>Start Steering</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Setup;
