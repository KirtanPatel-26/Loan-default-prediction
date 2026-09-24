import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  icon: Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex items-center gap-2 text-gray-300 mb-1">
          {Icon && (React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4 text-cyan-400" />)}
          <label className="text-sm font-medium tracking-wide">{label}</label>
        </div>
      )}
      <div 
        className={`relative rounded-xl overflow-hidden backdrop-blur-md bg-gray-900/60 border transition-all duration-300 ${
          isFocused ? 'border-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.4)]' : 'border-gray-700/50'
        }`}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full appearance-none bg-transparent text-gray-100 py-3 pl-4 pr-10 outline-none cursor-pointer text-sm font-medium transition-colors hover:bg-gray-800/30"
        >
          {options.map((opt, idx) => {
            const optValue = typeof opt === 'object' && opt !== null ? opt.value : opt;
            const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
            return (
              <option key={idx} value={optValue} className="bg-gray-900 text-gray-100 py-2">
                {optLabel}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFocused ? 'text-cyan-400 rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
