import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Lottie from 'react-lottie-player';

// 1. Zod Schema for Validation
const reportSchema = z.object({
  user_name: z.string().optional(),
  user_email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  message: z.string().min(10, "The description must be at least 10 characters long."),
});

// Suppress linter warning for the type definition
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ReportFormData = z.infer<typeof reportSchema>;

// ===================================================================
//  UPDATED REPORT FORM COMPONENT
// ===================================================================
const ReportForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    setSubmissionStatus(null);

    const SERVICE_ID = 'service_w612xqi';        // Your Service ID
    const TEMPLATE_ID = 'template_wciizfp';// IMPORTANT: Your Template ID
    const PUBLIC_KEY = '6xy2vZbTeoqCzVn2v';      // Your Public Key

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
      setSubmissionStatus('success');
      reset();
    } catch (error) {
      console.error('EmailJS submission error:', error);
      setSubmissionStatus('error');
    } finally {
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl p-8 md:p-12 mt-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Report Suspicious Activity</h2>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-300">Your submission helps protect our community. It will be handled with priority and confidentiality.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Your Name (Optional)"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-[#0F172A] dark:border-gray-600 dark:text-white"
            {...register('user_name')}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email (For follow-up)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-[#0F172A] dark:border-gray-600 dark:text-white ${errors.user_email ? 'border-red-500' : 'dark:border-gray-600'}`}
            {...register('user_email')}
          />
          {errors.user_email && <p className="text-red-500 text-sm mt-1">{errors.user_email.message}</p>}
        </div>
        <div>
          <textarea
            rows={5}
            placeholder="Please describe the suspicious activity in detail..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-[#0F172A] dark:border-gray-600 dark:text-white ${errors.message ? 'border-red-500' : 'dark:border-gray-600'}`}
            {...register('message')}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
        {submissionStatus === 'success' && <div className="text-green-700 dark:text-green-400 text-center">Report sent. Thank you for your vigilance.</div>}
        {submissionStatus === 'error' && <div className="text-red-700 dark:text-red-400 text-center">Submission failed. Please try again.</div>}
      </form>
    </motion.div>
  );
};


// ===================================================================
//  MAIN PAGE COMPONENT (No changes needed here)
// ===================================================================
const FraudAwarenessPage = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/images/fraud.json')
      .then(res => res.json())
      .then(setAnimationData)
      .catch(err => console.error("Failed to load fraud animation", err));
  }, []);

  const cards = [
    { title: 'Verify Communication', content: 'All official emails originate from an @higaiautomation.com address. Distrust any other source.' },
    { title: 'No Job Fees', content: 'HIG AI Automation never charges fees for job applications, interviews, or training. Any payment request is a scam.' },
    { title: 'Protect Your Information', content: 'Never share personal or financial data on unverified platforms like social media or chat apps.' },
  ];

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Fraud Awareness & Prevention | HIG AI Automation</title>
          <meta name="description" content="Protect yourself from online fraud. Learn to identify and report suspicious activities impersonating HIG AI Automation. Your security is our priority." />
        </Helmet>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Fraud Awareness & Prevention</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Your security is paramount. We are committed to protecting our community from fraudulent activities. Learn the signs of a scam and how to report it safely.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              {animationData && <Lottie animationData={animationData} loop={true} play={true} className="w-full max-w-sm mx-auto" />}
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <motion.div key={i} whileHover={{ y: -10, scale: 1.05 }} className="bg-white dark:bg-[#1E293B] shadow-lg rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{card.content}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Your updated form is used here */}
          <ReportForm />

        </div>
      </div>
    </HelmetProvider>
  );
};

export default FraudAwarenessPage;