import Navbar from "../components/Navbar";
import Button from "../components/Button";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h2 className="text-4xl font-bold mb-4">
          Turn YouTube into a Learning Machine
        </h2>
        <p className="text-gray-400 max-w-xl mb-8">
          AlgoSteer forces YouTube’s recommendation system to work for your
          education—not your distraction.
        </p>
        <Button onClick={handleLogin}>Get Started with Google</Button>
      </div>
    </>
  );
};

export default Login;
