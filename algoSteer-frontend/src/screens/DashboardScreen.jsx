import React, { useEffect, useState } from "react";
import axios from "axios";
import SteeringForm from "../components/SteeringForm";
import SteeringCard from "../components/SteeringCard"; // New Component
import { Loader2, Plus, Zap } from "lucide-react";

export default function DashboardScreen() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("user_email"));

  const fetchStatus = async (userEmail) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/status/${userEmail}`);
      setSession(res.data);
      // If they have no steerings, show the form by default
      if (!res.data.steerings || res.data.steerings.length === 0) {
        setShowForm(true);
      }
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSteering = async (steerId) => {
    try {
      await axios.post("http://localhost:5000/api/youtube/delete-steer", { 
        email, 
        steerId 
      });
      fetchStatus(email);
    } catch (err) {
      alert("Failed to delete steering");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlEmail = params.get("email");

    if (urlToken && urlEmail) {
      localStorage.setItem("yt_token", urlToken);
      localStorage.setItem("user_email", urlEmail);
      setEmail(urlEmail);
      fetchStatus(urlEmail);
      window.history.replaceState({}, document.title, "/dashboard");
    } else if (email) {
      fetchStatus(email);
    } else {
      window.location.href = "/";
    }
  }, [email]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold tracking-tighter text-red-600">ALGOSTEER // MULTI-ENGINE</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-xs bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            {showForm ? "VIEW ACTIVE" : <><Plus size={14} /> NEW STEER</>}
          </button>
        </div>

        {/* Conditional Form Rendering */}
        {showForm ? (
          <div className="mb-10 animate-in fade-in zoom-in duration-300">
            <SteeringForm 
              email={email} 
              onRefresh={() => {
                fetchStatus(email);
                setShowForm(false);
              }} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={18} className="text-red-600 fill-red-600" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Active Pulse Engines</h2>
            </div>
            
            {session?.steerings?.length > 0 ? (
              session.steerings.map((steer) => (
                <SteeringCard 
                  key={steer._id} 
                  steer={steer} 
                  onDelete={() => handleDeleteSteering(steer._id)} 
                />
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-gray-500">No active steerings found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}