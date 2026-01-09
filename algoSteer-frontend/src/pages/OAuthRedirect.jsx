import { useEffect } from "react";

const OAuthRedirect = () => {
  useEffect(() => {
    window.location.href = "/setup";
  }, []);

  return <p className="text-center mt-20">Signing you in...</p>;
};

export default OAuthRedirect;
