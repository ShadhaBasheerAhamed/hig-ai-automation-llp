import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import Header from './Header';
import Footer from './Footer';
import PolicyContent from './PolicyContent';

// --- Animated Background Components ---
const DarkBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            let particleCount = (canvas.width * canvas.height) / 20000;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas));
            }
        };

        class Particle {
            constructor(canvas) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
            }
            update(canvas) {
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let animationFrameId;
        const animate = () => {
            if (!canvas.getContext) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update(canvas);
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-40"></canvas>;
};

const LightBackground = () => {
    const styles = useSpring({
        from: { background: 'linear-gradient(135deg, #f5d0fe, #fbcfe8, #a5b4fc)' },
        to: async (next) => {
            while (1) {
                await next({ background: 'linear-gradient(135deg, #a5b4fc, #fbcfe8, #f5d0fe)' });
                await next({ background: 'linear-gradient(135deg, #fbcfe8, #f5d0fe, #a5b4fc)' });
            }
        },
        config: { duration: 10000 },
    });
    return <animated.div style={styles} className="fixed top-0 left-0 w-full h-full z-0 opacity-50" />;
};

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center p-4"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-slate-900 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-2xl">
                                &times;
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto text-slate-600 dark:text-slate-300 text-sm space-y-4">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Main Layout Component ---
const MainLayout = ({ theme, setTheme }) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    return (
        <div className={theme}>
            {theme === 'dark' ? <DarkBackground /> : <LightBackground />}
            <div className="relative z-10">
                <Header theme={theme} setTheme={setTheme} />
                <main>
                    <Outlet />
                </main>
                <Footer
                    onPrivacyClick={() => setIsPolicyModalOpen(true)}
                    onTermsClick={() => setIsTermsModalOpen(true)}
                />
            </div>

            {/* Modals for policy and terms */}
            <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Privacy Policy">
                <PolicyContent />
            </Modal>
            <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} title="Terms of Service">
                <p>Terms and Conditions content will go here.</p>
            </Modal>
        </div>
    );
};

export default MainLayout;