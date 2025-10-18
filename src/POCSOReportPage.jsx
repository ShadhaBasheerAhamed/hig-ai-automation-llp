// src/POCSOReportPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const POCSOReportPage = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Load EmailJS script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      // ✅ PASTE YOUR PUBLIC KEY HERE
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; 
      if (window.emailjs) {
        window.emailjs.init({ publicKey: PUBLIC_KEY });
        setIsScriptLoaded(true);
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch Lottie animation
  useEffect(() => {
    fetch('/images/pocso.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Error fetching Lottie animation:', err));
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    if (!isScriptLoaded || !window.emailjs || isSubmitting) {
      setSubmissionStatus('error');
      return;
    }
    setIsSubmitting(true);
    setSubmissionStatus(null);

    // ✅ PASTE YOUR SERVICE ID AND TEMPLATE ID HERE
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current)
      .then(() => {
        setSubmissionStatus('success');
        form.current.reset();
        setTimeout(() => setSubmissionStatus(null), 6000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setSubmissionStatus('error');
        setTimeout(() => setSubmissionStatus(null), 6000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>POCSO Protection Report | HIG AI Automation</title>
          <meta
            name="description"
            content="Report any child-related safety concerns under POCSO (Protection of Children from Sexual Offences Act). HIG AI Automation ensures confidentiality and immediate action to maintain a safe environment for minors."
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
              POCSO Protection & Child Safety Report
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              The Protection of Children from Sexual Offences (POCSO) Act safeguards the rights of minors.
              Use this confidential form to report any child safety or misconduct concerns. Every report is treated with sensitivity and urgency.
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
                <Lottie
                  animationData={animationData}
                  loop
                  play
                  className="w-full max-w-md"
                />
              ) : (
                <div className="w-full max-w-md h-96 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form
                ref={form}
                onSubmit={sendEmail}
                className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-2xl space-y-6"
              >
                <div>
                  <label
                    htmlFor="user_name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reporter Name (Optional)
                  </label>
                  <input
                    id="user_name"
                    type="text"
                    name="user_name"
                    placeholder="Anonymous"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="user_email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Contact Email (Optional)
                  </label>
                  <input
                    id="user_email"
                    type="email"
                    name="user_email"
                    placeholder="Your contact email"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="incident_details"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Incident Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="incident_details"
                    required
                    name="incident_details"
                    rows={6}
                    placeholder="Please describe the concern or incident in detail..."
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0F172A] px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isScriptLoaded}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit POCSO Report'}
                </button>

                {submissionStatus === 'success' && (
                  <div className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">
                    Report submitted successfully. Thank you for helping protect child safety.
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">
                    Submission failed. Please try again.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default POCSOReportPage;
