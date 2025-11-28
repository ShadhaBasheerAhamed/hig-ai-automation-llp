import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// --- Import Preloader ---
import Preloader from './Preloader.jsx';

// --- Layouts and Shared Components ---
import MainLayout from './MainLayout.jsx';
import ScrollToTop from './ScrollToTop.jsx';

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

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true); // State for the Loader

  // Apply theme mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // --- LOADING LOGIC ---
  useEffect(() => {
    const handleLoad = () => {
      // We set a small timeout (e.g., 2500ms = 2.5 seconds)
      // This ensures the Robot animation is seen before the site snaps in.
      setTimeout(() => {
        setIsLoading(false);
      }, 10000); 
    };

    // Check if the page has already loaded (in case of refresh)
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      // Wait for all assets (images, scripts) to fully load
      window.addEventListener("load", handleLoad);
    }

    // Cleanup listener
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {/* 1. If Loading is TRUE, show the Robot Preloader */}
      {isLoading ? (
        <Preloader />
      ) : (
        /* 2. If Loading is FALSE, show the Main Website */
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* ---------- PUBLIC ROUTES WITH MAIN LAYOUT ---------- */}
              <Route path="/" element={<MainLayout theme={theme} setTheme={setTheme} />}>
                {/* Core Pages */}
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="ourwork" element={<WorksPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PolicyContent />} />

                {/* Informational / Policy Pages */}
                <Route path="report-harassment" element={<HarassmentReportPage />} />
                <Route path="fraud-awareness" element={<FraudAwarenessPage />} />
                <Route path="policy" element={<PolicyInfoPages />} />
                <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="child-labour-policy" element={<ChildLabourPolicyPage />} />
                <Route path="pocso-report" element={<POCSOReportPage />} /> 
                
                {/* Review page */}
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
