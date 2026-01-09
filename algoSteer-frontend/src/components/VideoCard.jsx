export default function VideoCard({ video }) {
  return (
    <div className="bg-gray-900 rounded-lg p-3">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="rounded-md mb-2"
      />
      <p className="text-sm font-medium">{video.title}</p>
      <span className="text-xs text-gray-400">{video.channel}</span>
    </div>
  );
}
