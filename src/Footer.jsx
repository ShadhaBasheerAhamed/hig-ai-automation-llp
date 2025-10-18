import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const linkVariants = {
    hover: {
      scale: 1.05,
      originX: 0,
      color: 'rgb(79 70 229)', // text-indigo-600
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
    },
  };

  const quickLinks = [
    { path: '/about', label: 'ABOUT' },
    { path: '/services', label: 'SERVICES' },
    { path: '/ourwork', label: 'OURWORK' },
    { path: '/blog', label: 'BLOG' },
    { path: '/careers', label: 'CAREERS' },
    { path: '/contact', label: 'CONTACT' },
  ];

  const legalLinks = [
    { path: '/fraud-awareness', label: 'Be Aware of fraud' },
    { path: '/policy', label: 'Our Policy' },
    { path: '/terms-and-conditions', label: 'Terms & Conditions' },
    { path: '/report-harassment', label: 'Anti-Harassment Policy' },
    { path: '/child-labour-policy', label: 'Child Labour Policy' },
    { path: '/pocso-report', label: 'POCSO Protection' },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-[#0F172A]">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              HIG AI Automation LLP
            </h2>
            {/* ✅ FIX: This text was also faint. Added explicit color classes. */}
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Empowering businesses with AI automation. Transforming ideas into intelligent solutions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 tracking-wide">
              Quick Links
            </h3>
            {/* ✅ FIX: Removed text color from the parent <ul> */}
            <ul className="space-y-3 font-medium">
              {quickLinks.map((link) => (
                <motion.li key={link.path} whileHover="hover" variants={linkVariants}>
                  {/* ✅ FIX: Added text colors directly to the <Link> component */}
                  <Link 
                    to={link.path} 
                    className="text-slate-600 dark:text-slate-300 transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 tracking-wide">
              Legal & Policies
            </h3>
            {/* ✅ FIX: Removed text color from the parent <ul> */}
            <ul className="space-y-3 font-medium">
              {legalLinks.map((link) => (
                <motion.li key={link.path} whileHover="hover" variants={linkVariants}>
                  {/* ✅ FIX: Added text colors directly to the <Link> component */}
                  <Link 
                    to={link.path} 
                    className="text-slate-600 dark:text-slate-300 transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 tracking-wide">
              Get in Touch
            </h3>
            {/* ✅ FIX: Removed text color from the parent <div> */}
            <div className="space-y-3 font-medium">
                <p className="font-semibold text-slate-800 dark:text-slate-200">HIG AI Automation LLP</p>
                {/* ✅ FIX: Added text colors directly to this <p> tag */}
                <p className="text-slate-600 dark:text-slate-300">Tirunelveli, Tamil Nadu, India</p>
                
                {/* These <a> tags already had direct colors, so they were probably OK */}
                <a 
                  href="mailto:contact@higaiautomation.com" 
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                <FaEnvelope/> contact@higaiautomation.com
                </a>
                <a 
                  href="tel:+916381555777" 
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                    <FaPhoneAlt/> +91 6381 555 777
                </a>
                
                <div className="flex space-x-4 pt-2">
                  {/* ... social icons ... */}
                  {[
                 { icon: FaInstagram, href: 'https://www.instagram.com/hig_s_ai/?hl=en' }, 
                    { icon: FaLinkedin, href: 'https://www.linkedin.com/company/hig-automation-in/posts/?feedView=all' }, 
                    { icon: FaFacebook, href: 'https://www.facebook.com/share/1DF22iru91/' }
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={iconVariants}
                      whileHover="hover"
                      className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <social.icon size={22} />
                    </motion.a>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-6 py-5">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
                {/* This <p> tag already had direct colors and was probably fine */}
                <p className="mb-4 sm:mb-0 text-center sm:text-left text-slate-500 dark:text-slate-400">
                    © {new Date().getFullYear()} HIG AI Automation. All Rights Reserved.
                </p>
                {/* ✅ FIX: Removed text color from this parent <div> */}
                <div className="flex items-center space-x-6 font-medium">
                    {/* ✅ FIX: Added text colors directly to each <Link> */}
                    <Link to="/fraud-awareness" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Fraud Awareness</Link>
                    <Link to="/child-labour-policy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Child Labour Policy</Link>
                    <Link to="/pocso-report" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">POCSO Protection</Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;