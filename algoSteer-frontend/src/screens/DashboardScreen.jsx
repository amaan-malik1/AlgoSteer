import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SteeringForm from '../components/SteeringForm';
import CountdownDisplay from '../components/CountdownDisplay';
import { LayoutDashboard, Loader2 } from 'lucide-react';

export default function DashboardScreen() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('yt_token'));

  const fetchStatus = async () => {
    try {
      // In a real hackathon, get email from a decoded JWT or state
      const res = await axios.get(`http://localhost:5000/api/auth/status/taslimaparveen251315@gmail.com`);
      setSession(res.data);
    } catch (err) {
      console.error("Session fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('yt_token', urlToken);
      setToken(urlToken);
    }
    fetchStatus();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-12">
          <LayoutDashboard className="text-red-600" />
          <h1 className="text-2xl font-bold">Control Center</h1>
        </header>

        {session?.isSteeringActive ? (
          <CountdownDisplay session={session} />
        ) : (
          <SteeringForm token={token} onRefresh={fetchStatus} />
        )}
      </div>
    </div>
  );
}