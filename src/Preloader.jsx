import React from "react";
import Lottie from "lottie-react";
import robotAnimation from "./assets/robot-loading.json"; // Your JSON file

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Robot Animation */}
      <div className="w-64 h-64">
        <Lottie animationData={robotAnimation} loop={true} />
      </div>
      
      {/* Text Animation */}
      <h1 className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-pulse">
        HIG AI AUTOMATION...
      </h1>
    </div>
  );
};

export default Preloader;