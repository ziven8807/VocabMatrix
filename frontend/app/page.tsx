// frontend/app/page.tsx

"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Homepage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    const particleCount = 80;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Framer Motion 變體設定
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const flameVariants = {
    initial: {
      backgroundPosition: "0% 50%",
      filter: "hue-rotate(0deg)",
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      filter: ["hue-rotate(0deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"],
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-black"
      />

      <div className="relative z-10">
        <main className="flex flex-col items-center justify-center h-screen px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* 主標題 - 第一行 */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
              style={{ lineHeight: "1.1" }}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              Push yourself to
            </motion.h1>

            {/* 主標題 - 第二行 */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight"
              style={{ lineHeight: "1.1" }}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              higher peaks
            </motion.h1>

            {/* 副標題 */}
            <motion.div
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto space-y-4"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              <p className="text-gray-400 text-lg md:text-xl font-light pt-2">
                Education is what remains after one has forgotten everything he
                learned in school, so we do not learn for school but for life.
              </p>
            </motion.div>

            {/* Go 按鈕 */}
            <motion.button
              className="group relative w-32 h-32 rounded-full text-2xl font-bold text-white overflow-hidden"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Go</span>

              {/* 背景火焰效果 - 小 */}
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-50"
                style={{
                  backgroundSize: "150% 150%",
                  filter: "blur(3px)",
                  mixBlendMode: "screen",
                  transform: "scale(0.85)",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  filter: [
                    "hue-rotate(0deg) blur(3px)",
                    "hue-rotate(20deg) blur(3px)",
                    "hue-rotate(0deg) blur(3px)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* 背景火焰效果 - Hover */}
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                style={{
                  backgroundSize: "200% 200%",
                  filter: "blur(5px)",
                  mixBlendMode: "screen",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.8 }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  filter: [
                    "hue-rotate(0deg) blur(5px)",
                    "hue-rotate(20deg) blur(5px)",
                    "hue-rotate(0deg) blur(5px)",
                  ],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  filter: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  opacity: {
                    duration: 0.5,
                  },
                }}
              />
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Homepage;
