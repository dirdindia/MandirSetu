import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Dham3DGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // Auto-play interval
  useEffect(() => {
    if (!images || images.length <= 1 || selectedImage) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images, selectedImage]);

  if (!images || images.length === 0) return null;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (swipe > 50) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] flex justify-center items-center overflow-hidden" style={{ perspective: '1000px' }}>
      <div className="relative w-full max-w-5xl h-full flex justify-center items-center">
        <AnimatePresence initial={false}>
          {images.map((img, index) => {
            // Calculate distance from center index
            let diff = index - currentIndex;
            // Handle wrapping
            if (diff > Math.floor(images.length / 2)) diff -= images.length;
            if (diff < -Math.floor(images.length / 2)) diff += images.length;

            const isCenter = diff === 0;
            // Show up to 3 images on each side
            const isVisible = Math.abs(diff) <= 3;

            if (!isVisible) return null;

            // Positioning calculations
            const xPos = diff * 50; // percentage offset
            const scale = isCenter ? 1 : 1 - Math.abs(diff) * 0.15;
            const zIndex = 20 - Math.abs(diff);
            const opacity = isCenter ? 1 : 1 - Math.abs(diff) * 0.3;
            // 3D Rotation effect
            const rotateY = diff * -15; // side images turn inward slightly

            return (
              <motion.div
                key={index}
                className={`absolute w-64 h-80 sm:w-80 sm:h-96 md:w-[26rem] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-2 cursor-pointer ${isCenter ? 'border-[#dfba6b] shadow-[#dfba6b]/30' : 'border-[#dfba6b]/20 shadow-black/50'}`}
                initial={false}
                animate={{
                  x: `${xPos}%`,
                  scale,
                  zIndex,
                  opacity,
                  rotateY,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1] // Custom spring-like easing
                }}
                onClick={() => {
                  if (isCenter) {
                    setSelectedImage(img);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <img 
                  src={img} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover pointer-events-none" 
                />
                {/* Dark overlay for background items to simulate depth/shadow */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-[#5a1617]/40 pointer-events-none transition-opacity duration-600"></div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[#dfba6b] transition-colors p-2 bg-black/50 rounded-full"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={32} />
            </button>
            <motion.img 
              src={selectedImage} 
              alt="Fullscreen" 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-2 border-[#dfba6b]/50"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
