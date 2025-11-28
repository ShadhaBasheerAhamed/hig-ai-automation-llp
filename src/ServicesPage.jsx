import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Lottie from 'lottie-react'; // ✅ Switched to lottie-react for stability
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { HelmetProvider } from 'react-helmet-async'; // 1. Provider Import
import SEO from './SEO'; // 2. SEO Import

const AnimatedSection = ({ children, className, id }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    return (
        <motion.section
            id={id}
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

const ServiceCard = ({ iconUrl, title, description }) => (
    <motion.div
        className="relative p-6 rounded-2xl overflow-hidden text-center flex flex-col items-center 
                   bg-white/60 dark:bg-slate-800/50 
                   border border-slate-300/80 dark:border-slate-700 
                   group backdrop-blur-sm"
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
        variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
        }}
    >
        <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{
                background: 'radial-gradient(400px at 50% 50%, rgba(59, 130, 246, 0.3), transparent 80%)'
             }}
        />
        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-5 bg-slate-200/50 dark:bg-slate-900/50 p-4 rounded-full border border-slate-300 dark:border-slate-700">
                <img 
                    src={iconUrl || '/icons/placeholder.svg'}
                    alt={`${title} icon`} 
                    className="h-12 w-12"
                />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animationData, setAnimationData] = useState(null);

    // useEffect to load the Lottie animation
    useEffect(() => {
        fetch('/images/pjELxpvEGy.json') 
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error('Error loading services animation:', error));
    }, []);

    // useEffect to load services from Firestore
    useEffect(() => {
        setLoading(true);
        const servicesQuery = query(collection(db, 'services'), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(servicesQuery, (querySnapshot) => {
            const servicesData = querySnapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setServices(servicesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching services: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <HelmetProvider>
            {/* 🚀 SEO Integration: Detailed Service Keywords */}
            <SEO 
                title="Our Services - AI, RPA, Web & App Development | HIG AI"
                description="Explore HIG AI Automation's premium services: Custom AI Solutions, Intelligent Agents, RPA Workflow Automation, ERP Billing Software, and Mobile App Development in Tirunelveli."
                keywords="ai solutions, intelligent ai systems, ai agents platform, llm training, rag ai development, vector database solutions, hyperautomation, ai + rpa automation, erp billing software, crm ai integration, pwa development, ai mobile apps, automated lead capture, sales funnel automation, whatsapp api services, cloud deployment india, aws deployment services, ai company tirunelveli, software startup tamilnadu, digital transformation india, industry 4.0 automation, smart business workflows, Ai agents fine tuning, Website development, Mobile app development, Software developement, Buisness workflow automation (rpa), Billing & ERP application development, Lead generation, Digital marketing, All third party services"
            />

            <AnimatedSection id="services" className="py-32 container mx-auto px-6">
                
                {/* Lottie Animation Display */}
                <motion.div
                    className="max-w-xs mx-auto mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Updated for lottie-react */}
                    {animationData && ( <Lottie loop={true} animationData={animationData} /> )}
                </motion.div>
                
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Our Services</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                        From custom AI solutions to robust web platforms, we provide the tools you need to innovate and grow.
                    </p>
                </div>
                
                {loading ? (
                    <p className="text-center text-slate-700 dark:text-white">Loading services...</p>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {services.length > 0 ? (
                            services.map(service => <ServiceCard key={service.id} {...service} />)
                        ) : (
                            <p className="col-span-full text-center text-slate-500 dark:text-slate-400">No services have been added yet.</p>
                        )}
                    </motion.div>
                )}
            </AnimatedSection>
        </HelmetProvider>
    );
};

export default ServicesPage;