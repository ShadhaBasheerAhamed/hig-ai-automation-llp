// src/LoginPage.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
// FIX: Corrected the import path to include the file extension
import { auth } from './firebaseConfig.js';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('Failed to log in. Please check your email and password.');
        }
    };

    return (
        // CHANGE 1: Added padding on the main container for small screens
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4 sm:px-6 lg:px-8">
            {/* CHANGE 2: Adjusted padding on the card itself for different screen sizes */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* CHANGE 3: Made the title text size responsive */}
                <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
                    Admin Login
                </h2>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition">
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Need an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-500 hover:text-indigo-400">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

