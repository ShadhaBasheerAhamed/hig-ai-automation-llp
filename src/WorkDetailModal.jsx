// src/WorkDetailModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { opacity: 0, y: 30, scale: 0.95 },
};

const WorkDetailModal = ({ work, onClose }) => {
  if (!work) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose} // Close modal when clicking the backdrop
      >
        <motion.div
          key="modal"
          className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-auto border border-slate-700 shadow-2xl"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          {/* This is the logo/image you wanted to see */}
          <img 
            src={work.imageUrl || '/images/placeholders/default-work.jpg'} 
            alt={`${work.title} Logo`}
            className="w-full h-48 object-cover rounded-lg mb-6"
          />

          <h2 className="text-3xl font-bold text-white mb-4">{work.title}</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {work.description || 'No detailed description available.'}
          </p>

          <button
            onClick={onClose}
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkDetailModal;