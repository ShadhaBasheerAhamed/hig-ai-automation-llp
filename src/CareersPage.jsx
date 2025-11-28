import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import Lottie from 'react-lottie-player'; // ✅ Reverted to react-lottie-player as requested
import { HelmetProvider } from 'react-helmet-async'; 
import SEO from './SEO'; 

// --- Reusable "Outlined" form components ---
const FloatingLabelInput = ({ id, label, type = 'text', value, onChange }) => (
    <div className="relative">
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            className="peer w-full p-3 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder={label}
            required
        />
        <label
            htmlFor={id}
            className="absolute left-3 -top-2.5 bg-white dark:bg-slate-900 px-1 text-sm text-slate-500 dark:text-slate-400 transition-all 
                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500
                       peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400"
        >
            {label}
        </label>
    </div>
);

const FloatingLabelSelect = ({ id, label, value, onChange, children }) => (
    <div className="relative">
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="peer w-full p-3 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
            required
        >
            {children}
        </select>
        <label
            htmlFor={id}
            className="absolute left-3 -top-2.5 bg-white dark:bg-slate-900 px-1 text-sm text-indigo-600 dark:text-indigo-400"
        >
            {label}
        </label>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
        </div>
    </div>
);

// --- Main Careers Page Component ---
export default function CareersPage() {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Frontend Developer' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [animationData, setAnimationData] = useState(null);

    // Fetch the Lottie animation JSON file from the public directory
    useEffect(() => {
        fetch('/images/Robot Automation Gif.json')
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch(console.error);
    }, []);

    const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            await addDoc(collection(db, 'careerApplications'), { ...formData, submittedAt: serverTimestamp() });
            setSubmitStatus('success');
            setFormData({ name: '', email: '', role: 'Frontend Developer' });
        } catch (error) {
            console.error('Error submitting application: ', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    return (
        <HelmetProvider>
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen">
                
                {/* 🚀 SEO Integration: Career & Hiring Specific Keywords */}
                <SEO 
                    title="Careers at HIG AI - Join Our Tech Team in Tirunelveli"
                    description="Looking for AI jobs in Tirunelveli? Join HIG AI Automation. Hiring Frontend Developers, Backend Engineers, and AI/ML Specialists for our growing team."
                    keywords="HIG AI Automation Careers, AI jobs Tirunelveli, Software Engineer Jobs Tamilnadu, Frontend Developer Vacancy, Backend Developer Hiring, AI ML Engineer Jobs, Business Analyst Jobs, Tech Startup Careers India, Work in Artificial Intelligence, Automation Engineering Jobs, React JS Developer Jobs, Firebase Developer, Internship in Tirunelveli, Job Openings HIG AI, Join AI Team, Software Development Careers, Remote Tech Jobs India, Full Stack Developer Jobs, Fresher Jobs Tirunelveli, IT Jobs South India"
                />

                <div className="container mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Join Our Team
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg text-lg">
                                We're looking for passionate individuals to help us build the future of automation. If you are driven by innovation and excellence, we'd love to hear from you.
                            </p>
                             {/* Correct usage for react-lottie-player */}
                             {animationData && <Lottie loop animationData={animationData} play className="w-96 h-96 mx-auto md:mx-0" />}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <FloatingLabelInput id="name" label="Full Name" value={formData.name} onChange={handleInputChange} />
                                <FloatingLabelInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
                                <FloatingLabelSelect id="role" label="Applying for Role" value={formData.role} onChange={handleInputChange}>
                                    <option>Frontend Developer</option>
                                    <option>Backend Developer</option>
                                    <option>AI/ML Engineer</option>
                                    <option>Business Analyst</option>
                                </FloatingLabelSelect>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <AnimatePresence>
                                    {submitStatus === 'success' && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 dark:text-green-400 text-center">
                                            Thank you! Your application has been received.
                                        </motion.p>
                                    )}
                                    {submitStatus === 'error' && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 dark:text-red-400 text-center">
                                            Submission failed. Please try again.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
}
