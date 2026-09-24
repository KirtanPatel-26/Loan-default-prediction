import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Trophy, Target, Award, CheckCircle2, Zap, BarChart3 } from 'lucide-react';
import Card3D from '../3d/Card3D';

const ModelOverviewCards = ({ overview, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="glass p-4 rounded-2xl animate-pulse flex flex-col justify-between h-28">
            <div className="w-8 h-8 rounded-lg bg-white/5 mb-2" />
            <div className="h-3 w-16 bg-white/5 rounded" />
            <div className="h-6 w-12 bg-white/10 rounded mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="glass p-6 rounded-2xl border border-cyber-red/30 text-center">
        <p className="text-gray-400 text-sm">Unable to load model overview summary.</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Models',
      value: overview.total_models || 5,
      sub: 'Standardized ML Models',
      icon: Layers,
      color: 'text-cyber-blue',
      border: 'border-cyber-blue/30',
      bg: 'bg-cyber-blue/10'
    },
    {
      title: 'Top Performer',
      value: overview.best_model || 'Random Forest',
      sub: 'Leading F1 Score',
      icon: Trophy,
      color: 'text-yellow-400',
      border: 'border-yellow-400/30',
      bg: 'bg-yellow-400/10'
    },
    {
      title: 'Best Accuracy',
      value: overview.best_accuracy ? `${(overview.best_accuracy.value * 100).toFixed(1)}%` : '—',
      sub: overview.best_accuracy?.model || '',
      icon: Target,
      color: 'text-cyber-green',
      border: 'border-cyber-green/30',
      bg: 'bg-cyber-green/10'
    },
    {
      title: 'Best Precision',
      value: overview.best_precision ? `${(overview.best_precision.value * 100).toFixed(1)}%` : '—',
      sub: overview.best_precision?.model || '',
      icon: CheckCircle2,
      color: 'text-cyan-400',
      border: 'border-cyan-400/30',
      bg: 'bg-cyan-400/10'
    },
    {
      title: 'Best Recall',
      value: overview.best_recall ? `${(overview.best_recall.value * 100).toFixed(1)}%` : '—',
      sub: overview.best_recall?.model || '',
      icon: Award,
      color: 'text-purple-400',
      border: 'border-purple-400/30',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Best F1 Score',
      value: overview.best_f1 ? `${(overview.best_f1.value * 100).toFixed(1)}%` : '—',
      sub: overview.best_f1?.model || '',
      icon: Zap,
      color: 'text-pink-400',
      border: 'border-pink-400/30',
      bg: 'bg-pink-400/10'
    },
    {
      title: 'Best 5-Fold CV',
      value: overview.best_cv_score ? `${(overview.best_cv_score.value * 100).toFixed(1)}%` : '—',
      sub: overview.best_cv_score?.model || '',
      icon: BarChart3,
      color: 'text-emerald-400',
      border: 'border-emerald-400/30',
      bg: 'bg-emerald-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card3D className={`p-3.5 h-full flex flex-col justify-between ${c.border} rounded-2xl`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-medium truncate">
                  {c.title}
                </span>
                <div className={`p-1.5 rounded-lg ${c.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                </div>
              </div>
              <div>
                <div className={`text-lg sm:text-xl font-bold font-mono tracking-tight ${c.color}`}>
                  {c.value}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {c.sub}
                </div>
              </div>
            </Card3D>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModelOverviewCards;
