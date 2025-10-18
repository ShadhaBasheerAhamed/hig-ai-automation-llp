// src/AddBlogPage.jsx

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const AddBlogPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Company News');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !description || !category || !imageUrl || !author) {
      setError('Please fill out all fields.');
      return;
    }

    const newPost = {
      title,
      description,
      category,
      imageUrl,
      author,
      submittedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "blogs"), newPost);
      setSuccess('Blog post added successfully!');
      setTitle('');
      setDescription('');
      setCategory('Company News');
      setImageUrl('');
      setAuthor('');
    } catch (err) {
      console.error("Error adding document: ", err);
      setError('Failed to submit post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-6">
      <div className="container max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Blog Post</h1>
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4 text-center">{error}</p>}
        {success && <p className="text-green-400 bg-green-900/50 p-3 rounded-md mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Company News</option>
              <option>Use Case</option>
              <option>Case Studies</option>
              <option>Industry Insights</option>
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
            <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1">Author</label>
            <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="text-center pt-4">
            <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogPage;