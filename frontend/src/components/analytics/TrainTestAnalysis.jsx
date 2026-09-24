import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Flame, HelpCircle } from 'lucide-react';
import Card3D from '../3d/Card3D';

const TrainTestAnalysis = ({ trainTestData, modelName }) => {
  const trainScore = trainTestData?.train_score ?? 0.68;
  const testScore = trainTestData?.test_score ?? 0.67;
  const gap = trainTestData?.gap ?? (trainScore - testScore);
  const status = trainTestData?.status || (gap > 0.08 ? 'Possible Overfitting' : (trainScore < 0.6 && testScore < 0.6 ? 'Possible Underfitting' : 'Good Fit'));
  const explanation = trainTestData?.explanation || 'Training and testing scores are evaluated to ensure generalizability on real loan applications.';

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Possible Overfitting':
        return {
          bg: 'bg-rose-500/20 text-cyber-red border-rose-500/40',
          icon: AlertTriangle,
          desc: 'High Variance: Model memorized training noise.'
        };
      case 'Possible Underfitting':
        return {
          bg: 'bg-amber-500/20 text-cyber-amber border-amber-500/40',
          icon: AlertTriangle,
          desc: 'High Bias: Model lacks capacity to separate risk patterns.'
        };
      case 'Good Fit':
      default:
        return {
          bg: 'bg-emerald-500/20 text-cyber-green border-emerald-500/40',
          icon: CheckCircle2,
          desc: 'Optimal Balance: Generalizes reliably to new borrowers.'
        };
    }
  };

  const badge = getStatusBadge(status);
  const BadgeIcon = badge.icon;

  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Overfitting / Underfitting Analysis
            </h3>
            <p className="text-xs text-gray-400">
              Comparing training accuracy vs unseen test accuracy for {modelName || 'selected model'}
            </p>
          </div>
        </div>

        {/* Diagnosis Status Badge */}
        <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 text-xs font-mono font-bold tracking-wider ${badge.bg}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Comparison Bars */}
        <div className="lg:col-span-7 space-y-6">
          {/* Training Score Bar */}
          <div>
            <div className="flex justify-between items-center text-sm font-mono mb-2">
              <span className="text-gray-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-blue" />
                Training Score (Train Set)
              </span>
              <span className="text-cyber-blue font-bold text-lg">
                {(trainScore * 100).toFixed(2)}%
              </span>
            </div>
            <div className="h-4 w-full bg-dark-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyber-blue to-cyan-300 shadow-[0_0_12px_rgba(0,212,255,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${trainScore * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Testing Score Bar */}
          <div>
            <div className="flex justify-between items-center text-sm font-mono mb-2">
              <span className="text-gray-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green" />
                Testing Score (Holdout Test Set)
              </span>
              <span className="text-cyber-green font-bold text-lg">
                {(testScore * 100).toFixed(2)}%
              </span>
            </div>
            <div className="h-4 w-full bg-dark-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyber-green to-emerald-300 shadow-[0_0_12px_rgba(0,255,136,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${testScore * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
              />
            </div>
          </div>

          {/* Gap Metric Pill */}
          <div className="flex items-center justify-between p-3.5 glass rounded-xl border border-white/5">
            <span className="text-xs text-gray-400 font-mono">Performance Generalization Gap:</span>
            <span className="text-sm font-mono font-bold text-white">
              {(Math.abs(gap) * 100).toFixed(2)}% {gap > 0 ? '(Train > Test)' : '(Test ≥ Train)'}
            </span>
          </div>
        </div>

        {/* Diagnosis & Methodology Explanation */}
        <div className="lg:col-span-5">
          <div className="glass p-5 rounded-2xl border border-white/10 space-y-3 text-xs leading-relaxed">
            <div className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">
              Diagnostic Rationale
            </div>
            <p className="text-gray-200">
              {explanation}
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400 space-y-1">
              <div>• <strong>Good Fit</strong>: Train and Test scores differ by &lt; 8% and surpass baseline.</div>
              <div>• <strong>Overfitting</strong>: High train accuracy with noticeable testing degradation.</div>
              <div>• <strong>Underfitting</strong>: Both train and test accuracies fail to learn non-linear default indicators.</div>
            </div>
          </div>
        </div>
      </div>
    </Card3D>
  );
};

export default TrainTestAnalysis;
