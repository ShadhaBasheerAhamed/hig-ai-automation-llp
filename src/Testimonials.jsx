import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Link } from 'react-router-dom';

// ✨ CORRECTED COMPONENT ✨
// The props now correctly ask for `testimonialText` instead of `text`.
const TestimonialCard = ({ name, companyName, testimonialText, rating, submittedAt, logoUrl }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    
    // This is the fix: 
    // 1. We use `testimonialText` which matches your database field name.
    // 2. We add `|| ''` as a safeguard in case the field is ever missing, preventing the crash.
    const text = testimonialText || ''; 
    
    const charLimit = 180;
    const showReadMore = text.length > charLimit;

    // Helper to format the Firestore Timestamp into "Month Day, Year"
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        return timestamp.toDate().toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col flex-shrink-0 
                    w-[calc(100vw-4rem)] sm:w-[380px] md:w-[450px]
                    min-h-[280px] /* Taller cards for a better look */
                    bg-white dark:bg-slate-800 rounded-xl shadow-lg
                    border border-slate-200 dark:border-slate-700
                    mr-6 md:mr-8 my-4 p-6
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            
            {/* 1. Header: Logo, Company Name, User Name */}
            <div className="flex items-center mb-3">
                {logoUrl ? (
                    <img src={logoUrl} alt={`${companyName} logo`} className="w-12 h-12 rounded-full object-cover mr-4" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 mr-4"></div>
                )}
                <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{companyName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{name}</p>
                </div>
            </div>

            {/* 2. Rating */}
            <div className="flex text-yellow-400 mb-4">
                {/* Add a safeguard for rating as well */}
                {[...Array(rating || 0)].map((_, i) => <span key={i}>★</span>)}
                {[...Array(5 - (rating || 0))].map((_, i) => <span key={i} className="text-slate-300 dark:text-slate-600">★</span>)}
            </div>

            {/* 3. Feedback Text with "Read More" */}
            <div className="text-slate-600 dark:text-slate-300 text-base flex-grow">
                <p>
                    {showReadMore && !isExpanded ? `${text.substring(0, charLimit)}...` : text}
                </p>
                {showReadMore && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-500 hover:text-indigo-600 font-bold mt-2">
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>

            {/* 4. Date */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-right text-sm text-slate-400 dark:text-slate-500">
                {formatDate(submittedAt)}
            </div>
        </div>
    );
};


const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "testimonials"),
            where("status", "==", "approved"),
            orderBy("submittedAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const approvedTestimonials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTestimonials(approvedTestimonials);
        });
        return () => unsubscribe();
    }, []);

    // This function duplicates the array for a seamless animation loop.
    const createLoopedArray = (arr) => {
        if (!arr || arr.length === 0) return [];
        return [...arr, ...arr, ...arr];
    };
    
    const halfwayIndex = Math.ceil(testimonials.length / 2);
    const firstRow = createLoopedArray(testimonials.slice(0, halfwayIndex));
    const secondRow = createLoopedArray(testimonials.slice(halfwayIndex));

    return (
        <section id="testimonials" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">What Our Clients Say</h2>
                </div>
            </div>

            {testimonials.length > 0 && (
                <div className="flex flex-col gap-8">
                    <div className="scrolling-wrapper">
                        <div className="scrolling-content right-to-left">
                            {firstRow.map((testimonial, index) => <TestimonialCard key={`${testimonial.id}-r1-${index}`} {...testimonial} />)}
                        </div>
                    </div>
                    <div className="scrolling-wrapper">
                        <div className="scrolling-content left-to-right">
                            {secondRow.map((testimonial, index) => <TestimonialCard key={`${testimonial.id}-r2-${index}`} {...testimonial} />)}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mt-16 py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Help Us Grow!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">If you've had a positive experience, we'd be grateful for your review.</p>
                    <Link to="/leave-review" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        Leave a Review
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
