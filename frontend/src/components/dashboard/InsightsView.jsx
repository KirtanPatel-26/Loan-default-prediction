import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Layers, Code, Split } from 'lucide-react';

const InsightsView = () => {
  const insights = [
    { id: 1, title: 'Model Accuracy', value: '87.2%', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/20' },
    { id: 2, title: 'Features Analyzed', value: '24', icon: Layers, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { id: 3, title: 'Algorithm', value: 'Logistic Regression', icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    { id: 4, title: 'Training Split', value: '80/20', icon: Split, color: 'text-orange-400', bg: 'bg-orange-400/20' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white tracking-wide">Risk Insights & Analytics</h3>
        <Brain className="w-6 h-6 text-gray-400" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 flex-1"
      >
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className={`p-3 rounded-full ${insight.bg} mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${insight.color}`} />
              </div>
              <span className="text-2xl font-bold text-white mb-1">{insight.value}</span>
              <span className="text-xs text-gray-400 font-medium text-center uppercase tracking-wider">{insight.title}</span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
          Advanced analytics dashboard coming soon
        </p>
      </div>
    </div>
  );
};

export default InsightsView;
