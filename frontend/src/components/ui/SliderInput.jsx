import React, { useRef, useState } from 'react';

const SliderInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  icon: Icon,
  suffix = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleSliderChange = (e) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    let val = Number(e.target.value);
    if (!isNaN(val)) {
      if (val < min) val = min;
      if (val > max) val = max;
      onChange(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300">
          {Icon && (React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4 text-cyan-400" />)}
          <label className="text-sm font-medium tracking-wide">{label}</label>
        </div>
        <div className="flex items-center gap-1 bg-gray-900/50 rounded-md px-2 py-1 border border-gray-700/50 shadow-inner">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="w-16 bg-transparent text-right text-cyan-300 text-sm font-mono outline-none border-none hide-arrows"
          />
          {suffix && <span className="text-gray-400 text-sm font-mono">{suffix}</span>}
        </div>
      </div>

      <div className={`relative flex items-center h-8 transition-shadow duration-300 ${isFocused ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]' : ''}`}>
        {/* Custom Track Background */}
        <div className="absolute left-0 right-0 h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner border border-gray-700/50">
          {/* Active Track Fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#7b2ff7] to-[#00d4ff] transition-all duration-150 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Hidden Native Slider */}
        <input
          ref={inputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute w-full h-full opacity-0 cursor-pointer appearance-none z-20"
        />

        {/* Custom Thumb */}
        <div
          className="absolute h-5 w-5 bg-white rounded-full shadow-[0_0_10px_rgba(0,212,255,0.8)] border-2 border-cyan-400 z-10 pointer-events-none transition-transform duration-150 ease-out"
          style={{
            left: `calc(${percentage}% - 10px)`,
            transform: isFocused ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <div className="absolute inset-[4px] bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
