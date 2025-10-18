// src/MobileNavSidebar.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Using a simple object to map page names to their icon file paths.
// This is the most reliable method for production builds.
const iconMap = {
  home: '/icons/home-1-svgrepo-com.png',
  services: '/icons/services-svgrepo-com.png',
  ourwork: '/icons/work-svgrepo-com.png',
  blog: '/icons/blog-seo-optimization-search-svgrepo-com.png',
  careers: '/icons/job-search-svgrepo-com.png',
  contact: '/icons/contact-phonebook-support-svgrepo-com.png',
};

const ITEM_HEIGHT = 72;

const MobileNavSidebar = ({ isOpen, navLinks, currentPage, handleNavClick, theme }) => {
  const activeIndex = navLinks.findIndex((link) => link.page === currentPage);

  // This prevents crashes if the current page isn't found.
  if (activeIndex === -1) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 right-0 h-full w-24 z-[99] md:hidden ${
            theme === 'light' ? 'bg-white' : 'bg-slate-900'
          }`}
        >
          {/* THE FIX: The complex SVG liquid indicator has been removed. */}
          {/* We will now use a much simpler animated highlight. */}

          <ul className="relative pt-16 flex flex-col items-center w-full">
            {navLinks.map((link, index) => {
              const isActive = currentPage === link.page;
              const iconSrc = iconMap[link.iconKey];

              return (
                <li 
                  key={link.page} 
                  className="relative w-full"
                  style={{ height: `${ITEM_HEIGHT}px` }}
                >
                  {/* NEW: Simple and clean active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-mobile-indicator"
                      className={`absolute inset-0 w-full h-full ${
                        theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-500/30'
                      }`}
                      style={{ borderRadius: '12px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}

                  <button
                    onClick={() => handleNavClick(link.page)}
                    className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center no-underline"
                  >
                    <motion.span
                      animate={{ y: isActive ? -10 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <img 
                        src={iconSrc} 
                        alt={`${link.name} icon`} 
                        className={`h-7 w-7 transition-all duration-300 ${
                          isActive ? '' : (theme === 'light' ? 'filter grayscale opacity-50' : 'filter grayscale opacity-70')
                        }`}
                      />
                    </motion.span>
                    <motion.span
                      className="absolute text-xs font-medium"
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 16 : 24,
                        color: theme === 'light' ? '#0f172a' : '#fff',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileNavSidebar;

