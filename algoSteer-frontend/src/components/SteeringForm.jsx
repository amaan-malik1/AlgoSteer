import React, { useState } from 'react';
import axios from 'axios';
import { Target, Zap } from 'lucide-react';

export default function SteeringForm({ token, onRefresh }) {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSteer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/youtube/steer', {
        token, topic, days, email: "taslimaparveen251315@gmail.com"
      });
      onRefresh(); // Switch to countdown view
    } catch (err) {
      alert("Steering failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
      <form onSubmit={handleSteer} className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Focus Topic</label>
          <input 
            className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-red-500 outline-none"
            value={topic} onChange={e => setTopic(e.target.value)} required
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-2">Duration (Days)</label>
          <input 
            type="number" className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-red-500 outline-none"
            value={days} onChange={e => setDays(e.target.value)}
          />
        </div>
        <button 
          disabled={loading}
          className="w-full bg-red-600 py-4 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Rewiring Algorithm..." : "Force Feed"}
        </button>
      </form>
    </div>
  );
}