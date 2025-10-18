// src/HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import Testimonials from './Testimonials';
import WorksPage from './WorksPage';

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
        <>
            <HeroSection onExploreClick={handleExploreClick} />
            
            <WorksPage onWorkSelect={handleWorkSelect} />
            <Testimonials />
        </>
    );
};

export default HomePage;