import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertTriangle, MinusCircle } from 'lucide-react';

const RiskBreakdown = ({ riskFactors = [], isVisible }) => {
  const getIcon = (impact) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />;
      case 'negative': return <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />;
      case 'neutral': return <MinusCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />;
      default: return null;
    }
  };

  const getBarColor = (impact) => {
    switch (impact) {
      case 'positive': return 'bg-green-400/80 shadow-[0_0_10px_rgba(0,255,136,0.5)]';
      case 'negative': return 'bg-red-400/80 shadow-[0_0_10px_rgba(255,51,85,0.5)]';
      case 'neutral': return 'bg-gray-400/80';
      default: return 'bg-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl w-full"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Risk Factor Analysis</h3>
          </div>

          <div className="space-y-4">
            {riskFactors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                {getIcon(item.impact)}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{item.factor}</p>
                  <p className="text-sm text-gray-400 mt-1">{item.detail}</p>
                  <div className="w-full h-1.5 bg-gray-700/50 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.impact === 'positive' || item.impact === 'negative' ? '75%' : '40%' }}
                      transition={{ delay: index * 0.15 + 0.6, duration: 0.8, type: 'spring' }}
                      className={`h-full rounded-full ${getBarColor(item.impact)}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {riskFactors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No risk factors analyzed.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RiskBreakdown;
