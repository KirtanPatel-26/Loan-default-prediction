import React from 'react';

const Card3D = ({ children, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 ease-out ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Content wrapper */}
      <div className="w-full h-full relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card3D;
