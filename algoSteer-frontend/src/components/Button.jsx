const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
    >
      {children}
    </button>
  );
};

export default Button;
