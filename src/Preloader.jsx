import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const Preloader = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Fetch the animation from the public folder, just like in AboutUsPage
    // The file is at: public/images/robot-loading.json
    fetch("/images/robot-loading.json")
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data);
      })
      .catch((error) => console.error("Error loading robot animation:", error));
  }, []);

  // If the animation hasn't loaded yet, return null (or a simple white screen)
  // This prevents the "animationData is undefined" error
  if (!animationData) return <div className="fixed inset-0 z-50 bg-white"></div>;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Robot Animation */}
      <div className="w-64 h-64">
        <Lottie animationData={animationData} loop={true} />
      </div>
      
      {/* Text Animation */}
      <h1 className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-pulse">
        HIG AI AUTOMATION...
      </h1>
    </div>
  );
};

export default Preloader;
