import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO'; 

// --- Reusable Icon Components ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;


// --- Main Multi-Step Form Component ---
const LeaveReview = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        rating: 0,
        testimonialText: '',
        feedbackText: '',
        name: '',
        email: '',
        jobTitle: '',
        companyName: '',
        website: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : 1);

    const handleRatingSelect = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        // Conditional logic based on rating
        if (rating <= 3) {
            setStep(10); // Jump to negative feedback step
        } else {
            nextStep(); // Proceed to positive testimonial flow
        }
    };

    const handleSubmitFeedback = async () => {
        if (!formData.feedbackText) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "feedback"), {
                rating: formData.rating,
                feedback: formData.feedbackText,
                submittedAt: serverTimestamp()
            });
            setStep(11); // Show feedback thank you page
        } catch (error) {
            console.error("Error submitting feedback: ", error);
            alert("Sorry, there was an error submitting your feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitTestimonial = async () => {
        // Simple validation
        if (!formData.name || !formData.email || !formData.jobTitle || !formData.companyName) {
            alert("Please fill out all required fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "testimonials"), {
                name: formData.name,
                email: formData.email,
                jobTitle: formData.jobTitle,
                companyName: formData.companyName,
                website: formData.website,
                rating: formData.rating,
                testimonialText: formData.testimonialText,
                status: 'pending', // Default status for admin approval
                submittedAt: serverTimestamp()
            });
            setStep(5); // Show final thank you page
        } catch (error) {
            console.error("Error submitting testimonial: ", error);
            alert("Sorry, there was an error submitting your testimonial.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Step Components ---
    const renderStep = () => {
        const stepVariants = {
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -100 },
        };
        const motionProps = {
            initial: "hidden", animate: "visible", exit: "exit",
            variants: stepVariants, transition: { type: "spring", stiffness: 300, damping: 30 }
        };

        switch (step) {
            // POSITIVE FLOW
            case 1: return <motion.div {...motionProps}><StarRatingStep onSelectRating={handleRatingSelect} rating={formData.rating} /></motion.div>;
            case 2: return <motion.div {...motionProps}><TestimonialTextStep value={formData.testimonialText} onChange={handleInputChange} onContinue={nextStep} /></motion.div>;
            case 3: return <motion.div {...motionProps}><UserInfoStep data={formData} onChange={handleInputChange} onContinue={nextStep} /></motion.div>;
            case 4: return <motion.div {...motionProps}><CompanyInfoStep data={formData} onChange={handleInputChange} onContinue={handleSubmitTestimonial} isSubmitting={isSubmitting} /></motion.div>;
            case 5: return <motion.div {...motionProps}><ThankYouStepPositive /></motion.div>;
            
            // NEGATIVE FLOW
            case 10: return <motion.div {...motionProps}><FeedbackStep value={formData.feedbackText} onChange={handleInputChange} onContinue={handleSubmitFeedback} isSubmitting={isSubmitting} /></motion.div>;
            case 11: return <motion.div {...motionProps}><ThankYouStepFeedback /></motion.div>;
            
            default: return <p>Form completed. Thank you!</p>;
        }
    };

    return (
        <HelmetProvider>
            {/* 🚀 SEO Integration: Feedback & Review Keywords */}
            <SEO 
                title="Leave a Review - HIG AI Automation"
                description="Share your experience with HIG AI Automation. We value customer feedback to improve our AI, Web Development, and Automation services."
                keywords="Leave a Review HIG AI, Customer Feedback, Client Testimonials, Rate HIG AI Automation, Business Automation Reviews, Web Development Feedback Tirunelveli, Customer Satisfaction Survey, HIG AI Ratings, Client Success Stories, Improve AI Services"
            />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors">
                <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
                 
                    {step > 1 && step !== 5 && step !== 11 && (
                        <button onClick={prevStep} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                            <BackIcon />
                        </button>
                    )}
                </header>
                <main className="w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </main>
            </div>
        </HelmetProvider>
    );
};


// --- Individual Step Components ---
const StarRatingStep = ({ onSelectRating, rating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Do you enjoy using hig-ai?</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">On a scale of 1 to 5, how would you rate us?</p>
            <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => onSelectRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        className={`text-5xl transition-transform duration-200 transform hover:scale-125 
                        ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}>
                        ★
                    </button>
                ))}
            </div>
        </div>
    );
};

const TestimonialTextStep = ({ value, onChange, onContinue }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white flex items-center justify-center gap-2">Share why you love our product <HeartIcon /></h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">In a few sentences, share what you love about using our product.</p>
        <div className="text-left bg-white dark:bg-slate-800 p-4 rounded-lg mb-6 border border-slate-200 dark:border-slate-700">
            <p className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300"><span className="text-green-500"><CheckIcon /></span> Share where you found us.</p>
            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><span className="text-green-500"><CheckIcon /></span> Share any results you've had.</p>
        </div>
        <textarea name="testimonialText" value={value} onChange={onChange} rows="5" placeholder="Write your testimonial..."
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors mb-6" />
        <button onClick={onContinue} disabled={!value} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
            Continue
        </button>
    </div>
);

const UserInfoStep = ({ data, onChange, onContinue }) => (
    <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">About you</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Share a little more about yourself.</p>
        <div className="space-y-4">
            <input type="text" name="name" value={data.name} onChange={onChange} placeholder="Your name *" required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" />
            <input type="email" name="email" value={data.email} onChange={onChange} placeholder="Your email *" required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={onContinue} disabled={!data.name || !data.email} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-slate-400">Continue</button>
    </div>
);

const CompanyInfoStep = ({ data, onChange, onContinue, isSubmitting }) => (
    <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">About your company</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Share a little more about your company.</p>
        <div className="space-y-4">
            <input type="text" name="jobTitle" value={data.jobTitle} onChange={onChange} placeholder="Job title *" required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" />
            <input type="text" name="companyName" value={data.companyName} onChange={onChange} placeholder="Company *" required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" />
            <input type="url" name="website" value={data.website} onChange={onChange} placeholder="Website (optional)" className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={onContinue} disabled={isSubmitting || !data.jobTitle || !data.companyName} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-slate-400">
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
        </button>
    </div>
);

const FeedbackStep = ({ value, onChange, onContinue, isSubmitting }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Sorry to hear that!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Can you share what went wrong?</p>
        <textarea name="feedbackText" value={value} onChange={onChange} rows="5" placeholder="Write your feedback..."
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors mb-6" />
        <button onClick={onContinue} disabled={isSubmitting || !value} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-slate-400">
            {isSubmitting ? 'Submitting...' : 'Continue'}
        </button>
    </div>
);

const ThankYouStepPositive = () => (
    <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Thank you!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Testimonials help us grow our business. We appreciate you taking the time.</p>
        <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg">
            Back to Home
        </Link>
    </div>
);

const ThankYouStepFeedback = () => (
    <div className="text-center p-8">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
            <span className="text-3xl text-green-600 dark:text-green-300"><CheckIcon /></span>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Thank you for your feedback!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">We'll use your comments to improve our product.</p>
        <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg">
            Back to Home
        </Link>
    </div>
);

export default LeaveReview;