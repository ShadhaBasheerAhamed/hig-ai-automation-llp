import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// 1. Define the validation schema with Zod
const reportSchema = z.object({
  user_name: z.string().optional(),
  user_email: z.string().email("Please provide a valid email address.").optional().or(z.literal('')),
  message: z.string().min(20, "Incident details must be at least 20 characters long."),
});

// Create a TypeScript type from the schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ReportFormData = z.infer<typeof reportSchema>;

const HarassmentReportPage = () => {
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [animationData, setAnimationData] = useState(null);

  // 2. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  // Fetch Lottie animation
  useEffect(() => {
    fetch('/images/harras.json')
      .then((response) => response.json())
      .then(setAnimationData)
      .catch((error) => console.error("Error fetching Lottie animation:", error));
  }, []);

  // 3. Create the onSubmit handler
  const onSubmit = async (data: ReportFormData) => {
    setSubmissionStatus(null);

    // IMPORTANT: Replace with your actual IDs
    const SERVICE_ID = 'service_w612xqi';      // Your Service ID
    const TEMPLATE_ID = 'YOUR_HARASSMENT_TEMPLATE_ID'; // Your new Template ID
    const PUBLIC_KEY = '6xy2vZbTeoqCzVn2v';      // Your Public Key

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
      setSubmissionStatus('success');
      reset(); // Clear the form on success
    } catch (error) {
      console.error('EmailJS submission error:', error);
      setSubmissionStatus('error');
    } finally {
      // Hide the status message after 6 seconds
      setTimeout(() => setSubmissionStatus(null), 6000);
    }
  };

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Confidential Incident & Harassment Report | HIG AI Automation</title>
          <meta 
            name="description" 
            content="Report an incident confidentially at HIG AI Automation. We are committed to a safe, respectful, and secure workplace. Your privacy and security are our top priorities." 
          />
        </Helmet>
        
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Confidential Incident Report
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              At HIG AI Automation, we are committed to a safe and respectful environment. Please use this secure form to report any incidents. Your report will be handled with the utmost seriousness and confidentiality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="hidden md:flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {animationData ? (
                <Lottie animationData={animationData} loop={true} play={true} className="w-full max-w-md" />
              ) : (
                <div className="w-full max-w-md h-96 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* 4. Connect form to react-hook-form's handleSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-2xl space-y-6">
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name (Optional)</label>
                  <input id="user_name" type="text" placeholder="Anonymous" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white" 
                    {...register('user_name')}
                  />
                </div>
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email (Optional)</label>
                  <input id="user_email" type="email" placeholder="Your contact email for follow-up" className={`mt-1 block w-full border ${errors.user_email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white`}
                    {...register('user_email')}
                  />
                  {errors.user_email && <p className="text-red-500 text-sm mt-1">{errors.user_email.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Incident Details <span className="text-red-500">*</span>
                  </label>
                  <textarea id="message" rows={6} placeholder="Please describe the incident in detail..." className={`mt-1 block w-full border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white`}
                    {...register('message')}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Confidential Report'}
                </button>
                {submissionStatus === 'success' && <div className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">Report submitted successfully. Thank you.</div>}
                {submissionStatus === 'error' && <div className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">Submission failed. Please try again.</div>}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default HarassmentReportPage;