import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Card3D from '../3d/Card3D';

const CrossValidationSection = ({ cvData, modelName }) => {
  const folds = cvData?.folds || [0.6744, 0.6712, 0.6690, 0.6850, 0.6838];
  const mean = cvData?.mean ?? 0.6767;
  const std = cvData?.std ?? 0.0065;
  const spread = cvData?.spread ?? 0.0160;
  const stability = cvData?.stability || 'High Stability';

  const isStable = spread < 0.03;

  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              5-Fold Cross Validation
            </h3>
            <p className="text-xs text-gray-400">
              Fold-by-fold validation verifying robustness against sampling bias for {modelName || 'selected model'}
            </p>
          </div>
        </div>

        {/* Stability Badge */}
        <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 text-xs font-mono font-bold tracking-wider ${
          isStable ? 'bg-emerald-500/20 text-cyber-green border-emerald-500/40' : 'bg-amber-500/20 text-cyber-amber border-amber-500/40'
        }`}>
          {isStable ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{stability}</span>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Mean CV Score</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {(mean * 100).toFixed(2)}%
          </div>
          <span className="text-[10px] text-gray-500">Average across 5 data slices</span>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Standard Deviation (Std)</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            ±{(std * 100).toFixed(3)}%
          </div>
          <span className="text-[10px] text-gray-500">Low variance indicates consistency</span>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Score Spread (Max - Min)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {(spread * 100).toFixed(2)}%
          </div>
          <span className="text-[10px] text-gray-500">Range delta across 5 iterations</span>
        </div>
      </div>

      {/* 5-Fold Visual Column Chart */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1">
          Individual Fold Accuracies
        </span>
        <div className="grid grid-cols-5 gap-3 sm:gap-4 items-end h-44 p-4 glass rounded-2xl border border-white/5">
          {folds.map((score, index) => {
            const heightPct = Math.min(100, Math.max(20, (score / 0.8) * 100));
            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-mono font-bold text-cyber-blue opacity-80 group-hover:opacity-100 transition-opacity mb-2">
                  {(score * 100).toFixed(2)}%
                </span>
                <motion.div
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-cyber-blue/40 via-cyber-blue to-cyan-300 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.6)] transition-shadow"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
                <span className="text-xs font-mono text-gray-300 mt-2 font-medium">
                  Fold {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stability Educational Note */}
      <div className="mt-6 p-4 rounded-xl glass border border-white/5 flex items-start gap-3 text-xs text-gray-400">
        <Sparkles className="w-5 h-5 text-cyber-blue shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Understanding Cross-Validation Stability: </strong>
          A tight score spread (&lt; 3%) proves the model performs reliably regardless of which loan records are used for training vs validation. High spread (&gt; 6%) alerts credit underwriters that the model is sensitive to specific borrower subsets.
        </p>
      </div>
    </Card3D>
  );
};

export default CrossValidationSection;
