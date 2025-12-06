// src/BlogPostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO';

const BlogPostDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ 
            id: docSnap.id, 
            ...docSnap.data(),
            date: docSnap.data().submittedAt ? new Date(docSnap.data().submittedAt.seconds * 1000).toLocaleDateString() : 'Recent'
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (!post) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Post not found.</div>;

  return (
    <HelmetProvider>
        <div className="min-h-screen bg-slate-900 text-slate-300 pt-24 pb-12 px-6">
            <SEO 
                title={post.title} 
                description={post.description.substring(0, 150)} 
                keywords={`${post.category}, HIG AI Blog`} 
            />

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-flex items-center transition-colors">
                    ← Back to Blog
                </Link>
                
                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                    {/* Hero Image */}
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />

                    <div className="p-8 md:p-12">
                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-indigo-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                                {post.category}
                            </span>
                            <span className="text-slate-400 text-sm">
                                {post.date} • By {post.author}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {post.title}
                        </h1>
                        
                        {/* THE FULL CONTENT IS HERE - No Line Clamp */}
                        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {post.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </HelmetProvider>
  );
};

export default BlogPostDetail;