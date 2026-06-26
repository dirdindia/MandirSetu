import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the specific sect components
import VaishnavaHome from './VaishnavaHome';
import ShivaHome from './ShivaHome';
import ShaktiHome from './ShaktiHome';
import AnyaDevtaHome from './AnyaDevtaHome';

function Curtain({ isOpen }) {
  return (
    <div className="fixed inset-0 z-[100] flex pointer-events-none">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '-100%' : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full bg-gradient-to-r from-orange-600 to-orange-500 shadow-[20px_0_50px_rgba(0,0,0,0.5)] border-r-4 border-orange-300/50"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '100%' : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full bg-gradient-to-l from-orange-600 to-orange-500 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l-4 border-orange-300/50"
      />
    </div>
  );
}

function GatewaySelection({ onSelect }) {
  const sects = [
    { id: 'vaishnava', title: 'Vaishnava', desc: 'Devoted to Lord Vishnu & His avatars', icon: '🦚', color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'shiva', title: 'Shiva', desc: 'Devoted to Lord Shiva, the Destroyer', icon: '🔱', color: 'from-slate-600 to-slate-800', bg: 'bg-slate-100 dark:bg-slate-900/40' },
    { id: 'shakti', title: 'Shakti', desc: 'Devoted to the Divine Mother Goddess', icon: '🌺', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 'anya', title: 'Anya Devta', desc: 'Other revered deities and pantheons', icon: '🕉️', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-8"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Choose Your <span className="text-orange-500">Path</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select your spiritual tradition to personalize your MandirSetu experience with relevant temples, pujas, and dhams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {sects.map((sect, index) => (
            <motion.div
              key={sect.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, translateY: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(sect.id)}
              className={`cursor-pointer overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl ${sect.bg} relative group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sect.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="p-8 sm:p-10 flex flex-col items-center text-center h-full">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {sect.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {sect.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {sect.desc}
                </p>
                <div className="mt-8">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm group-hover:shadow-md transition-all">
                    Enter <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [selectedSect, setSelectedSect] = useState(null);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(true);

  const handleSectSelect = (sectId) => {
    setShowCurtain(true);
    setCurtainOpen(false); // Close curtain
    
    setTimeout(() => {
      setSelectedSect(sectId);
      setCurtainOpen(true); // Open curtain
      
      setTimeout(() => setShowCurtain(false), 1000); // Hide from DOM
    }, 800);
  };

  const renderSectHome = () => {
    switch (selectedSect) {
      case 'vaishnava': return <VaishnavaHome key="vaishnava" />;
      case 'shiva': return <ShivaHome key="shiva" />;
      case 'shakti': return <ShaktiHome key="shakti" />;
      case 'anya': return <AnyaDevtaHome key="anya" />;
      default: return null;
    }
  };

  return (
    <>
      {showCurtain && <Curtain isOpen={curtainOpen} />}
      <AnimatePresence mode="wait">
        {!selectedSect ? (
          <GatewaySelection key="gateway" onSelect={handleSectSelect} />
        ) : (
          renderSectHome()
        )}
      </AnimatePresence>
    </>
  );
}
