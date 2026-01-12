import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

export default function CountdownDisplay({ session }) {
  const calculateRemaining = () => {
    const start = new Date(session.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + session.totalDays);
    const diff = end - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="bg-gradient-to-br from-red-900/20 to-black p-10 rounded-3xl border border-red-500/30">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-red-500 uppercase tracking-widest text-sm font-bold">Active Focus</p>
          <h2 className="text-4xl font-black mt-2">{session.activeTopic}</h2>
        </div>
        <div className="bg-red-600 p-3 rounded-2xl">
          <Clock size={32} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase">Time Remaining</p>
          <p className="text-2xl font-bold">{calculateRemaining()} Days</p>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase">Target Platform</p>
          <p className="text-2xl font-bold">YouTube</p>
        </div>
      </div>

      <a 
        href="https://www.youtube.com" 
        target="_blank" 
        className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition"
      >
        Go to Curated Feed <ExternalLink size={18} />
      </a>
    </div>
  );
}