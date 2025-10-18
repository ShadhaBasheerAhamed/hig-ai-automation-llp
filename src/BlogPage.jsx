// src/BlogPage.jsx

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import BlogPostCard from './BlogPostCard';
import Lottie from 'react-lottie-player';

const categories = ['All', 'Case Studies', 'Use Case', 'Company News', 'Industry Insights'];

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/images/Man and robot with computers sitting together in workplace.json')
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error('Error loading animation:', error));
    }, []);

    useEffect(() => {
        setLoading(true);
        // --- FIX #1: Changed orderBy("date",...) to orderBy("submittedAt",...) ---
        const postsQuery = query(collection(db, "blogs"), orderBy("submittedAt", "desc"));
        
        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // --- FIX #2: Changed doc.data().date to doc.data().submittedAt ---
                // This reformats the timestamp for display on the card
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

    const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    // This now trims whitespace from the post's category before comparing
    : blogPosts.filter(post => post.category && post.category.trim() === activeCategory);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-24">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                    <div className="w-full max-w-md mx-auto">
                        {animationData && <Lottie loop animationData={animationData} play />}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Insights from HIG AI</h2>
                        <p className="text-slate-400 mt-4 max-w-2xl">
                            Stay updated with the latest news, use cases, and industry trends from our team of experts.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-wrap gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-300 mb-2 ${
                                activeCategory === category
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <p className="text-center text-white">Loading posts...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.length > 0 ? filteredPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} />
                        )) : <p className="text-center text-slate-400 col-span-full">No posts found in this category.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;