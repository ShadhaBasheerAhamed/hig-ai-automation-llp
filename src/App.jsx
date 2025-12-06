// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// --- Import Preloader ---
import Preloader from './Preloader.jsx';

// --- Layouts and Shared Components ---
import MainLayout from './MainLayout.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import WhatsAppChat from './WhatsAppChat.jsx'; // <--- 1. IMPORT THIS

// --- Core Pages ---
import HomePage from './HomePage.jsx';
import ServicesPage from './ServicesPage.jsx';
import WorksPage from './WorksPage.jsx';
import BlogPage from './BlogPage.jsx';
import CareersPage from './CareersPage.jsx';
import ContactPage from './ContactPage.jsx';
import AboutUsPage from './AboutUsPage.jsx';
import PolicyContent from './PolicyContent.jsx';

// --- Informational / Policy Pages ---
import HarassmentReportPage from './HarassmentReportPage.jsx';
import FraudAwarenessPage from './FraudAwarenessPage.jsx';
import ChildLabourPolicyPage from './ChildLabourPolicyPage.jsx';
import TermsAndConditionsPage from './TermsAndConditionsPage.jsx';
import PolicyInfoPages from './PolicyInfoPages.jsx';
import POCSOReportPage from './POCSOReportPage.jsx'; 

// --- Review Component ---
import LeaveReview from './LeaveReview.jsx';

// --- Auth & Admin Pages ---
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

import BlogPostDetail from './BlogPostDetail';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000); 
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            {/* 2. ADD THE BUTTON HERE - It will show on all pages */}
            <WhatsAppChat /> 
            
            <Routes>
              {/* ---------- PUBLIC ROUTES WITH MAIN LAYOUT ---------- */}
              <Route path="/" element={<MainLayout theme={theme} setTheme={setTheme} />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="ourwork" element={<WorksPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} /> 
                <Route path="careers" element={<CareersPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PolicyContent />} />
                <Route path="report-harassment" element={<HarassmentReportPage />} />
                <Route path="fraud-awareness" element={<FraudAwarenessPage />} />
                <Route path="policy" element={<PolicyInfoPages />} />
                <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="child-labour-policy" element={<ChildLabourPolicyPage />} />
                <Route path="pocso-report" element={<POCSOReportPage />} /> 
                <Route path="leave-review" element={<LeaveReview />} />
              </Route>

              {/* ---------- AUTH ROUTES ---------- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* ---------- PROTECTED ADMIN ROUTE ---------- */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard theme={theme} setTheme={setTheme} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      )}
    </>
  );
};

export default App;