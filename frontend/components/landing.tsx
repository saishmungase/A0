import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AnimatedIntroProps = {
  onComplete: () => void;
};

const AnimatedIntro: React.FC<AnimatedIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1000);
    const timer2 = setTimeout(() => setStage(2), 2500);
    const timer3 = setTimeout(() => setStage(3), 3500);
    const timer4 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 text-center px-4">
      <div className="relative">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-black text-green-400 flex items-center gap-4"
            >
              <span>ANIMATION</span>
              <span>ZERO</span>
            </motion.div>
          )}
          
          {stage === 1 && (
            <motion.div
              key="transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black text-green-400 flex items-center gap-4"
            >
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                ANIMATION
              </motion.span>
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                ZERO
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                0
              </motion.span>
            </motion.div>
          )}
          
          {stage === 2 && (
            <motion.div
              key="combine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-3xl md:text-4xl font-black text-green-400 flex items-center"
            >
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.6 }}
              >
                A
              </motion.span>
              <motion.span
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                NIMATION
              </motion.span>
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: -20 }}
                transition={{ duration: 0.6 }}
                className="ml-2"
              >
                0
              </motion.span>
            </motion.div>
          )}
          
          {stage === 3 && (
            <motion.div
              key="final"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2, y: -100 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-black text-green-400"
            >
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                className="inline-block"
              >
                A
              </motion.span>
              <motion.span
                initial={{ x: -20 }}
                animate={{ x: -5 }}
                className="inline-block"
              >
                0
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FloatingOrbs = () => {
  const orbs = [
    { size: 120, top: '10%', left: '15%', delay: 0 },
    { size: 80, top: '70%', left: '80%', delay: 1 },
    { size: 100, top: '40%', left: '5%', delay: 2 },
    { size: 60, top: '20%', left: '70%', delay: 0.5 },
    { size: 90, top: '80%', left: '20%', delay: 1.5 },
    { size: 70, top: '60%', left: '60%', delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            scale: [0, 1, 1, 0],
            y: [0, -30, -60, -30, 0],
            x: [0, 20, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-gradient-to-br from-green-400 to-green-600 blur-sm shadow-lg"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            boxShadow: `0 0 ${orb.size/2}px rgba(34, 197, 94, 0.4)`
          }}
        />
      ))}
    </div>
  );
};

const GridBackground = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      <motion.div
        animate={{ x: [0, 50], y: [0, 50] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </motion.div>
  );
};

const Landing = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <AnimatedIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">

        <GridBackground />
        
        <FloatingOrbs />

        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: showIntro ? 0 : 0.5 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex gap-8 px-8 py-4 rounded-full bg-black/30 backdrop-blur-md border border-green-400/20">
            <motion.a
              href="/"
              className="text-white hover:text-green-400 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.a>
            <motion.a
              href="/studio"
              className="text-white hover:text-green-400 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Studio
            </motion.a>
            <motion.a
              href="#"
              className="text-white hover:text-green-400 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Internals
            </motion.a>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: showIntro ? 0 : 1 }}
          className="flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 pt-30 pb-48 text-center"
          style={{ minHeight: 'calc(100vh - 200px)' }}
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 1.2 }}
            className="text-8xl md:text-9xl font-black mb-6 relative"
          >
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              A0
            </span>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-green-600/20 blur-xl rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 1.4 }}
            className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
          >
            Build Stunning 2D Animations
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 1.6 }}
            className="text-lg text-gray-400 mb-12 max-w-2xl text-center leading-relaxed"
          >
            Transform your creative vision into mesmerizing 2D animations with our intuitive, 
            powerful animation builder. Create, animate, and bring your stories to life.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 1.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold text-lg rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg relative overflow-hidden"
            href='/studio'
          >
            <motion.a
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            Start Creating
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: showIntro ? 0 : 2 }}
          className="relative mt-[-150px] mb-20 flex flex-wrap justify-center gap-6 z-10"
        >
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Real-time preview" },
            { icon: "🎨", title: "Intuitive Design", desc: "Drag & drop interface" },
            { icon: "🚀", title: "Export Ready", desc: "Multiple formats" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: showIntro ? 0 : 2.2 + index * 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.2)" }}
              className="text-center p-6 bg-black/30 backdrop-blur-md rounded-2xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-green-400 font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Landing;