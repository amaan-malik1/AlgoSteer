import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";

const Dashboard = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/focus/status")
      .then((res) => res.json())
      .then(setStatus);
  }, []);

  if (!status) return null;

  const progress =
    ((status.totalDays - status.daysRemaining) / status.totalDays) * 100;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Steering Active ✅</h2>

        <ProgressBar progress={progress} />

        <p className="mt-4 text-gray-400">
          {status.daysRemaining} days remaining
        </p>

        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
          <p className="text-lg font-semibold">Focus Topic</p>
          <p className="text-gray-400">{status.topic}</p>
        </div>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Open YouTube
        </a>
      </div>
    </>
  );
};

export default Dashboard;
