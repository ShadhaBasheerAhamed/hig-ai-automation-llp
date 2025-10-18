// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';


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
// ✅ FIX: Corrected the import name to match the component filename and usage
import POCSOReportPage from './POCSOReportPage.jsx'; 

// ✨ NEW: Import the LeaveReview component
import LeaveReview from './LeaveReview.jsx';

// --- Auth & Admin Pages ---
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

const App = () => {
  const [theme, setTheme] = useState('dark');

  // Apply theme mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
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
            {/* ✅ FIX: Corrected the path to be more conventional */}
            <Route path="pocso-report" element={<POCSOReportPage />} /> 
            
            {/* ✨ NEW: Add the route for the review page */}
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
  );
};

export default App;

