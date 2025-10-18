import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const TermsAndConditionsPage = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/images/higtermscond.json')
      .then(res => res.json())
      .then(setAnimationData)
      .catch(err => console.error("Failed to load terms animation", err));
  }, []);

  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing or using any services provided by HIG AI Automation, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access our services. These terms apply to all visitors, users, and others who wish to access or use the service.' },
    { title: 'Intellectual Property Rights', content: 'The service and its original content, features, and functionality are and will remain the exclusive property of HIG AI Automation and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HIG AI Automation.' },
    { title: 'User Conduct and Responsibilities', content: 'You agree not to use the service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts. You are responsible for any content you post and for your activity on the service.' },
    { title: 'Limitation of Liability', content: 'In no event shall HIG AI Automation, nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our services.' },
    { title: 'Governing Law', content: 'These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes will be handled in the jurisdiction of Tirunelveli, Tamil Nadu.' },
    { title: 'Changes to Terms', content: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.' },
  ];

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Terms and Conditions of Service | HIG AI Automation</title>
          <meta name="description" content="Read the official Terms and Conditions for using the HIG AI Automation website and services. This document outlines your rights, responsibilities, and our intellectual property rights." />
        </Helmet>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Terms & Conditions</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Please read these terms carefully before using our website and services. Your access to and use of the service is conditioned upon your acceptance of and compliance with these Terms.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              {/* --- FIX IS ON THIS LINE --- */}
              {animationData && <Lottie animationData={animationData} loop={true} play={true} className="w-full max-w-sm mx-auto" />}
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, scale: 1.03 }} 
                className="bg-white dark:bg-[#1E293B] shadow-lg rounded-xl p-8"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default TermsAndConditionsPage;