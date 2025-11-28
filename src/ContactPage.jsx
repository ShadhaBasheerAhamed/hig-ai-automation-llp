import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig'; // .js extension thevai illai, auto-resolve aagum
import Lottie from 'react-lottie-player'; // Neenga ketta library
import { HelmetProvider } from 'react-helmet-async'; 
import SEO from './SEO'; 

// --- Reusable "Outlined" components ---
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

const FloatingLabelTextarea = ({ id, label, value, onChange }) => (
    <div className="relative">
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            rows="4"
            className="peer w-full p-3 bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder={label}
            required
        />
        <label
            htmlFor={id}
            className="absolute left-3 -top-2.5 bg-white dark:bg-slate-900 px-1 text-sm text-slate-500 dark:text-slate-400 transition-all 
                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                       peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400"
        >
            {label}
        </label>
    </div>
);

const ContactPage = () => {
    const [formData, setFormData] = useState({ companyName: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [animationData, setAnimationData] = useState(null);

    // Correctly fetch animation data from the public folder
    useEffect(() => {
        fetch('/images/RobotSaludando.json')
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
            await addDoc(collection(db, 'contactRequests'), { ...formData, submittedAt: serverTimestamp() });
            setSubmitStatus('success');
            setFormData({ companyName: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting form: ', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    return (
        <HelmetProvider>
             <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen">
                
                {/* 🚀 SEO Integration: Contact Page Keywords */}
                <SEO 
                    title="Contact HIG AI Automation - Collaboration & Enquiries"
                    description="Partner with HIG AI Automation in Tirunelveli. Get a quote for AI solutions, Web Development, RPA, or Digital Marketing services."
                    keywords="Contact HIG AI, Business Collaboration, Hire AI Developers, Web Development Quote, Automation Services Enquiry, Tirunelveli IT Support, HIG AI Address, Partner with HIG, AI Consulting India, Digital Transformation Enquiry, Software Project Estimate"
                />

                <div className="container mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.8 }}
                            className="flex flex-col justify-center h-full"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Let's Collaborate
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg text-lg">
                                Have a project in mind? We'd love to hear about it. Fill out the form and we'll get back to you as soon as possible.
                            </p>
                            {animationData && <Lottie loop animationData={animationData} play className="w-96 h-96 mx-auto md:mx-0" />}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <FloatingLabelInput id="companyName" label="Company Name" value={formData.companyName} onChange={handleInputChange} />
                                <FloatingLabelInput id="email" label="Your Email" type="email" value={formData.email} onChange={handleInputChange} />
                                <FloatingLabelTextarea id="message" label="Tell us about your project" value={formData.message} onChange={handleInputChange} />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Collaboration Request'}
                                </button>
                                <AnimatePresence>
                                    {submitStatus === 'success' && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 dark:text-green-400 text-center">
                                            Thank you! Your message has been sent.
                                        </motion.p>
                                    )}
                                    {submitStatus === 'error' && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 dark:text-red-400 text-center">
                                            Something went wrong. Please try again.
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
};

export default ContactPage;