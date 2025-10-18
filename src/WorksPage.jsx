import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import Lottie from 'react-lottie-player';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import WorkDetailModal from './WorkDetailModal';


// Helper component for section animations (No changes)
const AnimatedSection = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {children}
        </motion.section>
    );
};

// --- Animated Number Component (No changes) ---
const AnimatedNumber = ({ value }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => `${Math.round(latest)}+`);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [isInView, value, count]);

    return <motion.h3 ref={ref}>{rounded}</motion.h3>;
};


// --- Stat Card Component (No changes) ---
const StatCard = ({ value, label, icon }) => (
    <motion.div
        className="relative p-8 rounded-2xl overflow-hidden text-center flex flex-col items-center justify-center
                   bg-white/60 dark:bg-slate-800/50 
                   border border-slate-300/80 dark:border-slate-700 
                   backdrop-blur-sm shadow-lg"
        variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            <AnimatedNumber value={value} />
        </div>
        <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{label}</p>
    </motion.div>
);

// --- Stats Section Component ---
const StatsSection = () => {
    const stats = [
        { value: 50, label: "Global Clients", icon: <UserGroupIcon /> },
        // ✨ UPDATED LINE: Replaced GlobeAltIcon with the new ComputerDesktopIcon
        { value: 150, label: "Websites Launched", icon: <ComputerDesktopIcon /> },
        { value: 250, label: "Happy Customers", icon: <HeartIcon /> }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.8 }
        }
    };

    return (
        <AnimatedSection>
            <div className="py-24 container mx-auto px-6">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

// (WorkCard component remains unchanged)
const WorkCard = ({ work, onSelect }) => (
    <motion.div
        onClick={() => onSelect(work)}
        className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg"
        style={{ aspectRatio: '4/3' }}
        layoutId={`card-container-${work.id}`}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <img
            src={work.imageUrl || '/images/placeholders/default-work.jpg'}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold">{work.title}</h3>
            <p className="text-slate-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {work.description ? `${work.description.substring(0, 80)}...` : ''}
            </p>
        </div>
    </motion.div>
);

const WorksPage = () => {
    const [animationData, setAnimationData] = useState(null);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState(null);

    useEffect(() => {
        fetch('/images/Animation - 1707744302440.json')
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error('Error loading work animation:', error));
    }, []);

    useEffect(() => {
        setLoading(true);
        const worksQuery = query(collection(db, 'works'), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(worksQuery, (querySnapshot) => {
            const worksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorks(worksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching works data: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCloseModal = () => {
        setSelectedWork(null);
    };

    return (
        <>
            <AnimatedSection>
                <div className="container mx-auto px-6 py-24 text-center">
                    <motion.div
                        className="max-w-md mx-auto mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {animationData && ( <Lottie loop animationData={animationData} play /> )}
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Our Proven Impact
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
                        We deliver tangible results. Explore some of the solutions we've engineered to drive growth and efficiency for our clients.
                    </p>

                    {loading ? (
                        <p className="text-center text-slate-700 dark:text-white">Loading our work...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                            {works.map(work => (
                                <WorkCard key={work.id} work={work} onSelect={setSelectedWork} />
                            ))}
                        </div>
                    )}
                </div>
            </AnimatedSection>
            
            <StatsSection />
            
            {selectedWork && <WorkDetailModal work={selectedWork} onClose={handleCloseModal} />}
        </>
    );
};


// --- SVG Icon Components ---
const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// ✨ NEW ICON: A clean, professional computer monitor icon.
const ComputerDesktopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
);

// ✨ GlobeAltIcon has been removed as it's no longer used.

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

export default WorksPage;
