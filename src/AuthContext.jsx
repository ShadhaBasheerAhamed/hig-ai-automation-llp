// src/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have a loading component

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  return useContext(AuthContext);
};

// The provider component that will wrap your entire app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // This is the key Firebase listener. It runs when the component mounts
    // and whenever the user's authentication state changes.
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Stop loading once we know the auth state
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  // While Firebase is checking the auth state, we show a loading spinner.
  // This prevents the page from flickering to the login page on a refresh.
  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
