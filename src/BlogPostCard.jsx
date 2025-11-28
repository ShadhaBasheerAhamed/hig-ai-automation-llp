import React from 'react';
import { motion } from 'framer-motion';

// Object to map categories to specific colors for their tags
// UPDATED: Now using lighter backgrounds with darker text for better theme compatibility
const categoryColors = {
  'All': 'bg-sky-100 text-sky-800',
  'Use Case': 'bg-indigo-100 text-indigo-800',
  'Company News': 'bg-emerald-100 text-emerald-800',
  'Industry Insights': 'bg-yellow-100 text-yellow-800',
  'Case Studies': 'bg-pink-100 text-pink-800',
};

const BlogPostCard = ({ post }) => {
  return (
    // The main card container with styling and hover effects
    <motion.div 
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
      whileHover={{ y: -5 }}
    >
      {/* Blog post image */}
      <img src={post.imageUrl || 'https://via.placeholder.com/400x200'} alt={post.title} className="w-full h-48 object-cover" />
      
      {/* Card content */}
      <div className="p-6">
        {/* UPDATED: Category tag now uses the improved color object */}
        <span className={`inline-block px-3 py-1 text-xs font-semibold ${categoryColors[post.category] || 'bg-slate-100 text-slate-800'} rounded-full mb-3`}>
          {post.category}
        </span>
        
        {/* ▼▼▼ TEXT COLOR FIXES ARE HERE ▼▼▼ */}

        {/* UPDATED: Title now switches color based on theme */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <a href="#">{post.title}</a>
        </h3>

        {/* UPDATED: Description now switches color based on theme */}
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{post.description}</p>
        
        {/* UPDATED: Author/Date now switches color based on theme */}
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 justify-between mt-auto">
          <div className="flex items-center">
            <span>By {post.author || 'HIG Team'}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>
          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">Read More →</button>
        </div>
        
        {/* ▲▲▲ END OF TEXT COLOR FIXES ▲▲▲ */}
      </div>
    </motion.div>
  );
};

export default BlogPostCard;