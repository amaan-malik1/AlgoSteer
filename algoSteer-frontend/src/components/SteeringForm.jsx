import React, { useState } from "react";
import axios from "axios";
import { Loader2, Target, Calendar, ArrowRight } from "lucide-react";

export default function SteeringForm({ email, onRefresh }) {
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSteer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("yt_token");

      // Points to the updated multi-steer endpoint
      await axios.post("http://localhost:5000/api/youtube/steer", {
        topic,
        days,
        email: email,
        token,
      });

      setTopic(""); // Clear input on success
      onRefresh(); // Refresh the list in Dashboard
    } catch (err) {
      console.error(err);
      alert("Steering failed. Check backend logs for API errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161616] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-600/20 p-3 rounded-2xl">
          <Target className="text-red-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            Add Pulse Engine
          </h2>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
            Inject New Topic Into Feed
          </p>
        </div>
      </div>

      <form onSubmit={handleSteer} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-widest ml-1">
              Focus Topic
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-black border border-white/5 rounded-2xl p-4 pl-5 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
                placeholder="e.g. Kubernetes Architecture"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-widest ml-1">
              <Calendar size={12} /> Duration (Days)
            </label>
            <input
              type="number"
              className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic}
          className="w-full group bg-white text-black hover:bg-red-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500 font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Synchronizing with YouTube API...</span>
            </>
          ) : (
            <>
              <span>INITIALIZE INJECTION</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
