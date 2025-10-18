import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';

import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const AboutUsPage = () => {
  const [animationData, setAnimationData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch the Lottie animation data 
  useEffect(() => {
    fetch('/images/aboutus.json')
      .then((response) => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch((error) => console.error("Error fetching Lottie animation:", error));
  }, []);

  const foundationCards = [
    {
      icon: '/icons/dart-mission-goal-success-svgrepo-com.png',
      title: 'Our Mission',
      content: 'To empower businesses of all sizes by unlocking the full potential of AI and automation. We streamline operations, boost efficiency, and create new avenues for growth in a competitive digital economy.'
    },
    {
      icon: '/icons/space-shuttle-svgrepo-com.png',
      title: 'Our Vision',
      content: 'To be a global leader in AI-driven automation, creating a seamless harmony between cutting-edge technology and human expertise to build the businesses of tomorrow.'
    },
    {
      icon: '/icons/correct-success-tick-svgrepo-com.png',
      title: 'Core Values',
      content: 'Innovation, Integrity, Collaboration, and Excellence. These principles are the bedrock of our company, guiding every decision we make and every solution we build.'
    }
  ];

  // Animation variants for sections and cards
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] transition-colors duration-500 overflow-x-hidden">
        <Helmet>
          <title>About HIG AI Automation | Our Mission, Vision, and Story</title>
          <meta 
            name="description" 
            content="Learn about HIG AI Automation, a leading provider of AI-driven solutions. Discover our mission to empower businesses through intelligent automation and our vision for the future." 
          />
        </Helmet>

        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              About HIG AI Automation
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Pioneering the future of business with intelligent, efficient, and scalable AI-driven automation that delivers tangible results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              className="order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                Founded on the principle that technology should serve humanity, HIG AI Automation began with a clear vision: to make advanced artificial intelligence and automation accessible to every business. We are committed to building solutions that not only enhance efficiency but also empower human potential.
              </p>
            </motion.div>
            <motion.div 
              className="order-1 lg:order-2 flex justify-center items-center h-80"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              {animationData ? (
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  play={isPlaying}
                  className="w-full max-w-sm" 
                />
              ) : (
                <div className="w-full max-w-sm h-full bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Foundation</h2>
          </motion.div>

          {/* Interactive Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {foundationCards.map((card, idx) => (
              <motion.div 
                key={idx} 
                className="bg-white dark:bg-[#1E2B3B] p-8 rounded-2xl shadow-lg flex flex-col items-center text-center relative overflow-hidden"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.05, shadow: "0px 15px 30px rgba(0, 0, 0, 0.2)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {/* Subtle gradient glow effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <img src={card.icon} alt={`${card.title} icon`} className="w-16 h-16 mb-6 relative z-10"/>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">{card.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">{card.content}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </HelmetProvider>
  );
};

export default AboutUsPage;

