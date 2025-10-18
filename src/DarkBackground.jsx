import React, { useRef, useEffect } from 'react';

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
                this.speedX = (Math.random() * 0.4 - 0.2);
                this.speedY = (Math.random() * 0.4 - 0.2);
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
            particles.forEach(p => {
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
        }
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-40"></canvas>;
};

export default DarkBackground;
