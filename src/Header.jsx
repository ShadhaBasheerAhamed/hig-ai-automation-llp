import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileNavSidebar from './MobileNavSidebar';
import { HelmetProvider } from 'react-helmet-async'; // 1. Provider Import
import SEO from './SEO'; // 2. SEO Import

// --- Reusable Icon and Toggle Button Components ---
const ThemeToggleButton = ({ theme, setTheme }) => (
    <AnimatePresence mode="wait" initial={false}>
        <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-yellow-400 bg-slate-200 dark:bg-slate-700/50 transition-colors"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            key={theme}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <img 
              src={theme === 'light' ? '/icons/moon-svgrepo-com.png' : '/icons/sun-svgrepo-com.png'} 
              alt="Theme toggle icon"
              className="w-6 h-6"
            />
        </motion.button>
    </AnimatePresence>
);

const AnimatedHamburgerIcon = ({ isOpen, onClick }) => {
    const topVariants = { closed: { rotate: 0, translateY: 0 }, open: { rotate: 45, translateY: 6 } };
    const middleVariants = { closed: { opacity: 1 }, open: { opacity: 0 } };
    const bottomVariants = { closed: { rotate: 0, translateY: 0 }, open: { rotate: -45, translateY: -6 } };
    return (
        <button onClick={onClick} className="w-6 h-6 relative z-[101] text-slate-800 dark:text-white">
            <motion.div className="w-6 h-0.5 bg-current absolute" style={{ top: '15%' }} variants={topVariants} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3 }} />
            <motion.div className="w-6 h-0.5 bg-current absolute" style={{ top: '50%', transform: 'translateY(-50%)' }} variants={middleVariants} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.1 }} />
            <motion.div className="w-6 h-0.5 bg-current absolute" style={{ bottom: '15%' }} variants={bottomVariants} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3 }} />
        </button>
    );
};

// --- Main Header Component ---
const Header = ({ theme, setTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate(); // For programmatic navigation

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", page: "/", iconKey: "home" },
        { name: "Services", page: "/services", iconKey: "services" },
        { name: "Our Work", page: "/ourwork", iconKey: "ourwork" },
        { name: "Blog", page: "/blog", iconKey: "blog" },
        { name: "Careers", page: "/careers", iconKey: "careers" },
        { name: "Contact", page: "/contact", iconKey: "contact" }
    ];

    const handleNavClick = (page) => {
        navigate(page);
        setMenuOpen(false);
    };
    
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto' };
    }, [menuOpen]);

    return (
        <HelmetProvider>
            {/* 🚀 SEO Integration: Global Keywords for the entire site */}
            <SEO 
                keywords="ai solutions, intelligent ai systems, ai agents platform, llm training, rag ai development, vector database solutions, hyperautomation, ai + rpa automation, erp billing software, crm ai integration, pwa development, ai mobile apps, automated lead capture, sales funnel automation, whatsapp api services, cloud deployment india, aws deployment services, ai company tirunelveli, software startup tamilnadu, digital transformation india, industry 4.0 automation, smart business workflows, Ai agents fine tuning, Website development, Mobile app development, Software developement, Buisness workflow automation (rpa), Billing & ERP application development, Lead generation, Digital marketing, All third party services"
            />

            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg' : ''}`}>
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    
                    {/* Left Section: Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img src="/images/hig-logo.png" alt="HIG AI Automation Logo" className="h-10" />
                        </Link>
                    </div>

                    {/* Center Section: Navigation Links (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-1 relative">
                            {navLinks.map(link => {
                                const isActive = location.pathname === link.page;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.page}
                                        className={`text-sm font-medium relative transition px-4 py-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'}`}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="magic-indicator"
                                                className="magic-indicator"
                                                initial={false}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section: Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                      <ThemeToggleButton theme={theme} setTheme={setTheme} />
                      <Link to="/contact" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105">
                          Collaborate
                      </Link>
                    </div>

                    {/* Mobile Section: Hamburger Menu and Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        <AnimatedHamburgerIcon isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                    </div>
                </nav>
            </header>

            <MobileNavSidebar 
                isOpen={menuOpen}
                navLinks={navLinks}
                currentPage={location.pathname}
                handleNavClick={handleNavClick}
                theme={theme} 
            />
        </HelmetProvider>
    );
};

export default Header;