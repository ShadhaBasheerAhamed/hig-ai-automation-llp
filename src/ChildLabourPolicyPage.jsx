import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import emailjs from '@emailjs/browser'; // ✨ IMPORT: Use the installed package

// Reusable Form Component for reporting concerns
const ReportForm = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null

  // ✨ REPLACE these with your actual EmailJS credentials
  const YOUR_SERVICE_ID = 'service_w612xqi';
  const YOUR_TEMPLATE_ID = 'template_9gvod28';
  const YOUR_PUBLIC_KEY = '6xy2vZbTeoqCzVn2v';

  const sendEmail = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);

    // ✨ UPDATED: Modern way to send email using the package
    emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, form.current, YOUR_PUBLIC_KEY)
      .then(
        () => {
          setSubmissionStatus('success');
          form.current.reset(); // Clear the form on success
        },
        (error) => {
          console.error('FAILED...', error.text);
          setSubmissionStatus('error');
        }
      )
      .finally(() => {
        setIsSubmitting(false);
        // Hide the success/error message after 5 seconds
        setTimeout(() => setSubmissionStatus(null), 5000);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl p-8 md:p-12 mt-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Report a Concern</h2>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-300">Your submission will be handled with the utmost seriousness and confidentiality.</p>
      
      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        {/* The 'name' attributes must match the variables in your EmailJS template, e.g., {{from_name}} */}
        <input type="text" name="from_name" placeholder="Your Name (Optional)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-[#0F172A] dark:border-gray-600 dark:text-white"/>
        <textarea name="message" rows="5" required placeholder="Please provide a detailed description of your concern regarding our child labour policy..." className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-[#0F172A] dark:border-gray-600 dark:text-white"/>
        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : 'Submit Confidential Report'}
        </button>
        {submissionStatus === 'success' && <div className="text-green-700 dark:text-green-400 text-center">Report sent. Thank you for your commitment to ethical practices.</div>}
        {submissionStatus === 'error' && <div className="text-red-700 dark:text-red-400 text-center">Submission failed. Please try again.</div>}
      </form>
    </motion.div>
  );
};

const ChildLabourPolicyPage = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/images/childlabour.json')
      .then(res => res.json())
      .then(setAnimationData)
      .catch(err => console.error("Failed to load child labour animation", err));
  }, []);

  const cards = [
    { title: 'Zero-Tolerance Stance', content: 'We strictly and unequivocally prohibit child labour in all our business operations and supply chains, without exception.' },
    { title: 'Ethical Supply Chain', content: 'We conduct regular, rigorous audits to ensure all our partners and suppliers adhere to international child labour laws and standards.' },
    { title: 'Empowerment & Education', content: 'We are committed to action, actively working to educate our partners and provide resources to combat child exploitation in the tech industry.' },
  ];

  return (
    <HelmetProvider>
      <div className="bg-gray-50 dark:bg-[#0F172A] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Child Labour Abolition Policy | HIG AI Automation</title>
          <meta name="description" content="HIG AI Automation has a zero-tolerance policy against child labour. Learn about our unwavering commitment to ethical employment practices and our entire supply chain." />
        </Helmet>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Child Labour Abolition Policy</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">We are committed to upholding and protecting the rights of every child. Our operations and partnerships are built on a foundation of ethical compliance and social responsibility.</p>
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
          <ReportForm />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ChildLabourPolicyPage;
