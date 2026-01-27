import { Zap, ExternalLink } from "lucide-react";

export default function CountdownDisplay(session: any) {
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(session.startDate).getTime() +
        session.totalDays * 86400000 -
        Date.now()) /
        86400000,
    ),
  );

  const lastPulse = session.lastSync
    ? new Date(session.lastSync).toLocaleTimeString()
    : "Pending...";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-red-600/20 to-black border border-white/10 p-10 rounded-[2rem]">
        <div className="flex items-center gap-2 mb-4 text-yellow-500">
          <Zap size={16} fill="currentColor" className="animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Pulse Engine Active
          </span>
        </div>

        <h2 className="text-5xl font-black mb-2">{session.activeTopic}</h2>
        <p className="text-gray-500 mb-8">
          Home feed is being forcefully rewired every 10 minutes.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-xs uppercase mb-1">
              Duration Left
            </p>
            <p className="text-3xl font-bold">{daysLeft} Days</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-xs uppercase mb-1">
              Last Algo-Inject
            </p>
            <p className="text-3xl font-bold">{lastPulse}</p>
          </div>
        </div>

        <a
          href="https://youtube.com"
          target="_blank"
          className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
        >
          View My New Feed <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
}
