import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, LineChart, Info, Activity } from 'lucide-react';

const TABS = [
  { id: 'Prediction', label: 'Prediction', icon: BarChart3 },
  { id: 'Analytics', label: 'Model Analytics', icon: Activity },
  { id: 'Insights', label: 'Insights', icon: LineChart },
  { id: 'About', label: 'About', icon: Info },
];

/**
 * Header navigation component
 *
 * @param {Object} props
 * @param {string} [props.activeTab='Prediction'] - Current active tab name ('Prediction' | 'Insights' | 'About')
 * @param {function} [props.onTabChange] - Callback invoked when a tab is selected
 */
const Header = ({ activeTab = 'Prediction', onTabChange = () => {} }) => {
  const isTabActive = (tabId) => {
    if (!activeTab) return false;
    return activeTab.toLowerCase() === tabId.toLowerCase();
  };

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      // Support matching caller's preferred case (e.g. 'Prediction' vs 'prediction')
      if (activeTab && activeTab === activeTab.toLowerCase()) {
        onTabChange(tabId.toLowerCase());
      } else {
        onTabChange(tabId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30">
      {/* Ambient gradient glow line along bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 gap-3 sm:gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div
              onClick={() => handleTabClick('Prediction')}
              className="flex items-center gap-3 cursor-pointer select-none group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick('Prediction');
                }
              }}
            >
              {/* Shield Icon with glowing halo */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-cyber-blue/25 blur-md group-hover:bg-cyber-blue/40 transition-colors duration-300" />
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-dark-800 to-dark-700 border border-cyber-blue/40 group-hover:border-cyber-blue/70 shadow-[0_0_15px_rgba(0,212,255,0.25)] transition-all duration-300">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-blue drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                </div>
              </div>

              {/* Brand Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-white glow-text">
                    LoanShield
                  </span>
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-cyber-blue drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]">
                    AI
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase -mt-0.5 hidden sm:block">
                  Risk Intelligence Platform
                </span>
              </div>
            </div>

            {/* Mobile AI status indicator */}
            <div className="flex sm:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
              <span>Active</span>
            </div>
          </div>

          {/* Center/Right: Tab Navigation Buttons */}
          <nav aria-label="Main Navigation" className="w-full sm:w-auto">
            <div className="flex items-center w-full sm:w-auto p-1 bg-dark-800/60 rounded-xl border border-white/5 backdrop-blur-md">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = isTabActive(tab.id);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue/50 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    {/* Active highlight background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabHighlight"
                        className="absolute inset-0 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    {/* Active tab animated underline */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyber-blue rounded-full shadow-[0_0_10px_#00d4ff,0_0_20px_rgba(0,212,255,0.6)]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    {/* Icon & Label */}
                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isActive
                            ? 'text-cyber-blue drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className="tracking-wide">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;
