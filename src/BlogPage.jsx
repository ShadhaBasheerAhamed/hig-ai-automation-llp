// src/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import BlogPostCard from './BlogPostCard';
import Lottie from 'react-lottie-player';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO';
// 👇 1. Import Framer Motion for Animations
import { motion, AnimatePresence } from 'framer-motion';

// 👇 Note: Make sure "Industry Insights" spelling matches EXACTLY with Admin Panel
const categories = ['All', 'Case Studies', 'Use Case', 'Company News', 'Industry Insights'];

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [animationData, setAnimationData] = useState(null);

    // Fetch Lottie JSON
    useEffect(() => {
        fetch('/images/Man and robot with computers sitting together in workplace.json')
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error('Error loading animation:', error));
    }, []);

    // Fetch Firebase Data
    useEffect(() => {
        setLoading(true);
        const postsQuery = query(collection(db, "blogs"), orderBy("submittedAt", "desc"));
        
        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().submittedAt ? new Date(doc.data().submittedAt.seconds * 1000).toLocaleDateString() : 'No date',
            }));
            setBlogPosts(postsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching blog posts: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 👇 Improved Filter Logic (Checks for whitespace issues)
    const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category && post.category.trim() === activeCategory);

    return (
        <HelmetProvider>
            <div className="min-h-screen bg-slate-900 text-white">
                <SEO 
                    title="HIG AI Insights - Blog, News & Case Studies"
                    description="Stay updated with the latest AI trends, HIG AI Automation company news, and success stories."
                    keywords="ai solutions, intelligent ai systems, ai agents platform, llm training, rag ai development"
                />

                <div className="container mx-auto px-6 py-24">
                    
                    {/* Header Section with Lottie */}
                    <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                        <div className="w-full max-w-md mx-auto">
                            {animationData && <Lottie animationData={animationData} loop={true} play />}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">Insights from HIG AI</h2>
                            <p className="text-slate-400 mt-4 max-w-2xl">
                                Stay updated with the latest news, use cases, and industry trends from our team of experts.
                            </p>
                        </div>
                    </div>

                    {/* 👇 Filter Buttons (Styling Improved) */}
                    <div className="flex justify-center items-center flex-wrap gap-4 mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium text-sm md:text-base ${
                                    activeCategory === category
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105" // Active Style
                                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white" // Inactive Style
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* 👇 Blog Grid with Animation */}
                    {loading ? (
                        <p className="text-center text-slate-400 animate-pulse">Loading posts...</p>
                    ) : (
                        <motion.div 
                            layout 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        // 👇 Wrapping BlogPostCard with motion.div for animation
                                        <motion.div
                                            key={post.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <BlogPostCard post={post} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="col-span-full text-center py-10"
                                    >
                                        <p className="text-slate-500 text-lg">
                                            No posts found for <span className="text-indigo-400">"{activeCategory}"</span>
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </HelmetProvider>
    );
};

export default BlogPage;