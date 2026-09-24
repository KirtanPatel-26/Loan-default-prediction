import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  
  // Track state for interaction styles
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Use refs for animation variables to avoid React re-renders on every frame
  const mouse = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const requestRef = useRef(null);
  
  useEffect(() => {
    // Ensure styles are initialized
    if (innerRef.current) {
      innerRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
    }
    if (outerRef.current) {
      outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%)`;
    }

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Immediately update inner dot
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
      }
    };
    
    const animate = () => {
      // Lerp for outer ring
      outerPos.current.x += (mouse.current.x - outerPos.current.x) * 0.15;
      outerPos.current.y += (mouse.current.y - outerPos.current.y) * 0.15;
      
      if (outerRef.current) {
        // Calculate the scale based on isClicking state, handled mostly by CSS transition,
        // but we inject the base transform here
        outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%) ${isClicking ? 'scale(0.8)' : 'scale(1)'}`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'select' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isClicking]);

  return (
    <>
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '50px' : '28px',
          height: isHovering ? '50px' : '28px',
          border: '2px solid #00d4ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
          transition: 'width 0.2s ease-out, height 0.2s ease-out',
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: '#00d4ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 8px rgba(0, 212, 255, 0.8)',
        }}
      />
    </>
  );
};

export default CustomCursor;
