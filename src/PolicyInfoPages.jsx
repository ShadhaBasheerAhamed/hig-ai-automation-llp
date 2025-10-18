import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PolicyPage = () => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/images/policysapm.json')
            .then((response) => response.json())
            .then(setAnimationData)
            .catch((error) => console.error("Error fetching Lottie animation:", error));
    }, []);

    const policyCards = [
        { title: 'Zero Tolerance', content: 'We enforce a strict zero-tolerance policy against discrimination, harassment, and any form of bullying.' },
        { title: 'Data Privacy & Security', content: 'We are fully compliant with global data protection laws to ensure the highest security for client and company data.' },
        { title: 'Corporate Responsibility', content: 'We are committed to environmental sustainability, ethical practices, and positive community impact.' },
        { title: 'Continuous Innovation', content: 'Our policies foster a culture of learning and development to keep us at the forefront of the AI industry.' }
    ];

    return (
        <HelmetProvider>
            <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <Helmet>
                    <title>Our Company Policies | HIG AI Automation</title>
                    <meta name="description" content="Explore the core company policies of HIG AI Automation, covering our commitment to ethics, data privacy, security, and corporate social responsibility." />
                </Helmet>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Our Company Policies</h1>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                At HIG AI Automation, we are dedicated to upholding the highest standards of business conduct and operational integrity. Our policies are the foundation of our commitment to excellence.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                            {animationData ? (
                                <Lottie animationData={animationData} loop={true} play={true} className="w-full max-w-sm mx-auto" />
                            ) : (
                                <div className="w-full max-w-sm h-64 mx-auto bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                            )}
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {policyCards.map((card, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -10, scale: 1.05 }}
                                className="bg-white dark:bg-[#1E293B] shadow-xl rounded-2xl p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{card.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
};

export default PolicyPage;
