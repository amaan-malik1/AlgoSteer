const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-800 rounded-full h-3">
      <div
        className="bg-green-500 h-3 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
