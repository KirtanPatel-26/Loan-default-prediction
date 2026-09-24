import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getVariantColors = (variant) => {
  switch (variant) {
    case 'secondary':
      return { gradient: '#7b2ff7, #ff2d95', shadow: 'rgba(123, 47, 247, 0.5)' };
    case 'danger':
      return { gradient: '#ff3355, #ffaa00', shadow: 'rgba(255, 51, 85, 0.5)' };
    case 'primary':
    default:
      return { gradient: '#00d4ff, #7b2ff7', shadow: 'rgba(0, 212, 255, 0.5)' };
  }
};

const ProButton = ({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
  ...props
}) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const colors = getVariantColors(variant);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled || loading) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const maxOffset = 4;
    const offsetX = ((e.clientX - centerX) / (width / 2)) * maxOffset;
    const offsetY = ((e.clientY - centerY) / (height / 2)) * maxOffset;
    setPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (disabled || loading) return;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    }

    if (onClick) onClick(e);
  };

  const styleBase = {
    '--btn-grad': colors.gradient,
    '--btn-shadow': colors.shadow,
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.96, y: disabled || loading ? 0 : 2 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={styleBase}
      className={`relative group overflow-hidden rounded-xl font-medium tracking-wide flex items-center justify-center p-[2px] transition-all duration-300 ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {/* Rotating conic gradient border wrapper */}
      <div className="absolute inset-0 z-0 before:absolute before:inset-[-50%] before:animate-[spin_4s_linear_infinite] group-hover:before:animate-[spin_2s_linear_infinite] before:content-['']" 
           style={{ background: `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${colors.gradient.split(',')[0]} 80%, ${colors.gradient.split(',')[1]} 100%)`}} />
      <div className="absolute inset-0 z-0 bg-gray-900 rounded-[10px] m-[1px] group-hover:bg-gray-800 transition-colors" />

      {/* Glow shadow */}
      <div 
        className="absolute inset-0 -z-10 rounded-xl blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-300"
        style={{ backgroundColor: colors.gradient.split(',')[0] }}
      />

      <div className="relative z-10 px-6 py-3 flex items-center gap-2 text-white">
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && icon && <span className="flex items-center">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </div>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute z-10 rounded-full bg-white pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

export default ProButton;
