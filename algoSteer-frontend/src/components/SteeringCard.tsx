import { Trash2, Clock, Activity } from "lucide-react";

export default function SteeringCard({ steer, onDelete }:any) {
  const lastPulse = steer.lastSync 
    ? new Date(steer.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : "Initializing...";

  return (
    <div className="bg-[#161616] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-600/30 transition-colors group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={14} className="text-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Live Pulse Active</span>
        </div>
        <h3 className="text-2xl font-black capitalize tracking-tight">{steer.topic}</h3>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Clock size={14} />
            Last Inject: {lastPulse}
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            Interval: 10m
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block mr-4">
            <p className="text-[10px] text-gray-600 uppercase font-bold">Duration</p>
            <p className="font-mono text-sm">{steer.totalDays} Days</p>
        </div>
        <button 
          onClick={onDelete}
          className="bg-red-600/10 p-4 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white transition-all group-hover:scale-105"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}