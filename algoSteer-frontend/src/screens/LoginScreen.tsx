import { Youtube, Zap } from 'lucide-react';

export default function LoginScreen() {
  const handleLogin = () => window.location.href = 'http://localhost:5000/api/auth/google';

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-red-600/10 rounded-full">
        <Youtube className="text-red-600 w-12 h-12" />
      </div>
      <h1 className="text-6xl font-black text-white mb-4">ALGOSTEER</h1>
      <p className="text-gray-400 text-xl max-w-md mb-10">Stop browsing content. Start mastering it.</p>
      
      <button 
        onClick={handleLogin}
        className="relative group bg-white text-black text-lg font-bold px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      >
        <div className="absolute inset-0 rounded-2xl bg-white animate-pulse blur-xl opacity-20 group-hover:opacity-40"></div>
        <span className="relative z-10 flex items-center gap-3">
          <Zap size={20} fill="black" /> Connect YouTube
        </span>
      </button>
    </div>
  );
}