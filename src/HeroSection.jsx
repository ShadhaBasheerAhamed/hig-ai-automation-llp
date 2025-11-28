import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react'; // ✅ Switched to lottie-react

const HeroSection = ({ onExploreClick }) => {
    const [animationData, setAnimationData] = useState(null);

    // This hook fetches the JSON animation file from the public folder
    useEffect(() => {
        // The path must be exactly as the file is named in your public/images folder
        fetch('/images/THNOkGgv3C (1).json')
          .then((response) => response.json())
          .then((data) => setAnimationData(data))
          .catch((error) => console.error('Error loading hero animation:', error));
      }, []);

    const containerVariants = {
        animate: { transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden">
            
            {/* This div now contains the high-quality Lottie animation player */}
            <div className="w-40 h-40 absolute top-28 animate-marquee-bidirectional hover:[animation-play-state:paused]">
              {/* Only render the animation player after the JSON file has loaded */}
              {animationData && (
                <Lottie
                    loop={true} // ✅ Syntax for lottie-react
                    animationData={animationData}
                    style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
            
            <div className="container mx-auto relative z-10">
                <div className="flex justify-center">
                    
                    <motion.div 
                        variants={containerVariants} 
                        initial="initial" 
                        animate="animate" 
                        className="text-center max-w-2xl mt-32"
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                            Welcome to <span className="gradient-text">HIG AI Automation</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            We build custom AI solutions that streamline operations and drive unprecedented growth.
                        </motion.p>

                        <motion.div variants={itemVariants}>
                            <button
                                onClick={onExploreClick}
                                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/30"
                            >
                                Explore Our Solutions
                            </button>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;