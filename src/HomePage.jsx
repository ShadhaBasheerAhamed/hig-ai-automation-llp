import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import Testimonials from './Testimonials';
import WorksPage from './WorksPage';
import { HelmetProvider } from 'react-helmet-async'; // 1. Provider Import
import SEO from './SEO'; // 2. SEO Import

const HomePage = () => {
    const navigate = useNavigate();

    // This function will be passed to the "Explore Our Solutions" button
    const handleExploreClick = () => {
        navigate('/services');
        window.scrollTo(0, 0);
    };

    // The onWorkSelect prop for WorksPage can be handled here if needed,
    // for example, to open a modal. For now, we'll pass a placeholder.
    const handleWorkSelect = (work) => {
        console.log("Selected work:", work);
        // You can add modal logic here later
    };

    return (
        <HelmetProvider>
            {/* 🚀 SEO Integration: Home Page Keywords */}
            <SEO 
                title="HIG AI Automation - Custom AI Agents & Web Development Company"
                description="HIG AI Automation LLP transforms businesses with intelligent AI agents, custom web development, and RPA solutions in Tirunelveli and India."
                keywords="HIG AI Automation, AI Company India, Custom AI Agents, Web Development Services, Business Automation, RPA Solutions, Tirunelveli Tech Company, Digital Transformation, AI Software Development, Intelligent Process Automation, HIG AI Home"
            />

            <HeroSection onExploreClick={handleExploreClick} />
            
            <WorksPage onWorkSelect={handleWorkSelect} />
            <Testimonials />
        </HelmetProvider>
    );
};

export default HomePage;