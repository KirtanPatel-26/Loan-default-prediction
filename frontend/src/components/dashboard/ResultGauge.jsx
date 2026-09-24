import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResultGauge = ({ probability, prediction, riskLevel, creditHealth, isVisible }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = Math.round(probability * 100);
      const duration = 1500; // ms
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setDisplayValue(Math.round(easeOutQuart * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayValue(0);
    }
  }, [isVisible, probability]);

  const getColor = (prob) => {
    if (prob < 0.3) return '#00ff88'; // green
    if (prob < 0.6) return '#ffaa00'; // amber
    return '#ff3355'; // red
  };

  const color = getColor(probability);
  const radius = 100;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability * circumference);

  const getRiskColorClass = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-400/20 shadow-[0_0_15px_rgba(0,255,136,0.3)]';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20 shadow-[0_0_15px_rgba(255,170,0,0.3)]';
      case 'HIGH': return 'text-red-400 bg-red-400/20 shadow-[0_0_15px_rgba(255,51,85,0.3)]';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm mx-auto"
        >
          <div className="relative flex items-center justify-center mb-6">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90 drop-shadow-xl"
            >
              {/* Background track */}
              <circle
                stroke="rgba(255, 255, 255, 0.1)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Foreground progress */}
              <motion.circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={circumference + ' ' + circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 10px ${color}80)`
                }}
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold tracking-tighter" style={{ color }}>
                {displayValue}%
              </span>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">
                Probability
              </span>
            </div>
          </div>

          <div className="text-center space-y-4 w-full">
            <div className={`inline-block px-6 py-2 rounded-full font-bold tracking-wider ${getRiskColorClass(riskLevel)}`}>
              {riskLevel} RISK
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 w-full text-center">
              <p className="text-gray-300 font-medium text-lg leading-relaxed">
                {creditHealth}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultGauge;
