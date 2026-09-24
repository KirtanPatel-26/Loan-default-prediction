import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Award, Zap, HelpCircle, Filter } from 'lucide-react';
import Card3D from '../3d/Card3D';
import SelectInput from '../ui/SelectInput';

const ModelEvaluationSection = ({
  models = [],
  selectedModel,
  onSelectModel,
  metricsData,
  loading
}) => {
  const modelOptions = models.map(m => ({
    value: m.id,
    label: m.name
  }));

  const metrics = metricsData?.metrics || {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1: 0
  };

  const metricCards = [
    {
      name: 'Accuracy',
      value: (metrics.accuracy * 100).toFixed(2) + '%',
      raw: metrics.accuracy,
      icon: Target,
      color: 'text-cyber-green',
      barColor: 'bg-cyber-green',
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]',
      tooltip: 'Percentage of total loan predictions that were correct (both default and non-default).'
    },
    {
      name: 'Precision',
      value: (metrics.precision * 100).toFixed(2) + '%',
      raw: metrics.precision,
      icon: CheckCircle2,
      color: 'text-cyber-blue',
      barColor: 'bg-cyber-blue',
      glow: 'shadow-[0_0_15px_rgba(0,212,255,0.3)]',
      tooltip: 'Among applicants predicted to default, how many actually defaulted. Minimizes false accusations.'
    },
    {
      name: 'Recall',
      value: (metrics.recall * 100).toFixed(2) + '%',
      raw: metrics.recall,
      icon: Award,
      color: 'text-purple-400',
      barColor: 'bg-purple-400',
      glow: 'shadow-[0_0_15px_rgba(123,47,247,0.3)]',
      tooltip: 'Among actual defaulters, how many were correctly detected. Critical for avoiding charge-offs.'
    },
    {
      name: 'F1 Score',
      value: (metrics.f1 * 100).toFixed(2) + '%',
      raw: metrics.f1,
      icon: Zap,
      color: 'text-pink-400',
      barColor: 'bg-pink-400',
      glow: 'shadow-[0_0_15px_rgba(255,45,149,0.3)]',
      tooltip: 'Harmonic mean of Precision and Recall. Balances credit risk detection and customer retention.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue animate-pulse" />
            Model Evaluation
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Standardized classification metrics evaluated on 5,000 unseen test loan records.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SelectInput
            label="Active Model"
            value={selectedModel}
            onChange={onSelectModel}
            options={modelOptions.length ? modelOptions : ['logistic_regression', 'decision_tree', 'random_forest', 'adaboost', 'gradient_boosting']}
            icon={<Filter className="w-4 h-4 text-cyber-blue" />}
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card3D className="p-6 h-full flex flex-col justify-between rounded-2xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-white tracking-wide">
                        {m.name}
                      </span>
                    </div>
                    
                    {/* Tooltip trigger */}
                    <div className="group relative cursor-help">
                      <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-cyber-blue transition-colors" />
                      <div className="absolute right-0 bottom-6 hidden group-hover:block z-50 w-64 p-3 glass-strong rounded-xl text-xs text-gray-300 leading-relaxed shadow-2xl border border-white/20 pointer-events-none">
                        {m.tooltip}
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="my-4">
                    <span className={`text-4xl font-extrabold font-mono tracking-tight ${m.color} drop-shadow-sm`}>
                      {loading ? '...' : m.value}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>Performance</span>
                    <span>{(m.raw * 100).toFixed(1)} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      className={`h-full rounded-full ${m.barColor} ${m.glow}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, m.raw * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelEvaluationSection;
