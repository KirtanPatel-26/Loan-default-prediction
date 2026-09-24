import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, CheckCircle2, Sliders, BarChart2 } from 'lucide-react';
import Card3D from '../3d/Card3D';

const FinalEvaluationSection = ({ modelData }) => {
  if (!modelData) return null;

  const m = modelData;
  const metrics = m.metrics || {};
  const cm = m.confusion_matrix || {};
  const tt = m.train_test || {};
  const cv = m.cross_validation || {};
  const hp = m.hyperparameters || {};

  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-cyber-blue/30 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30">
            <Award className="w-6 h-6 text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Final Model Evaluation Scorecard
            </h3>
            <p className="text-xs text-gray-400">
              Consolidated production readiness verification for <strong className="text-white">{m.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Validated on 255k Loan Dataset</span>
        </div>
      </div>

      {/* Grid of Key Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="glass p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Testing Accuracy</span>
          <div className="text-2xl font-bold text-cyber-green mt-1">
            {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(2)}%` : '—'}
          </div>
          <span className="text-[10px] text-gray-500">Unseen holdout</span>
        </div>

        <div className="glass p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Precision (Default)</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {metrics.precision ? `${(metrics.precision * 100).toFixed(2)}%` : '—'}
          </div>
          <span className="text-[10px] text-gray-500">Predicted defaulters</span>
        </div>

        <div className="glass p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Recall (Sensitivity)</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {metrics.recall ? `${(metrics.recall * 100).toFixed(2)}%` : '—'}
          </div>
          <span className="text-[10px] text-gray-500">Captured defaulters</span>
        </div>

        <div className="glass p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">F1 Harmonic Score</span>
          <div className="text-2xl font-bold text-pink-400 mt-1">
            {metrics.f1 ? `${(metrics.f1 * 100).toFixed(2)}%` : '—'}
          </div>
          <span className="text-[10px] text-gray-500">Balanced measure</span>
        </div>
      </div>

      {/* 3 Summary Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Confusion Matrix Breakdown */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <span className="text-xs font-mono uppercase text-gray-400 tracking-wider block font-semibold">
            Confusion Matrix Summary
          </span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-emerald-500/10 text-emerald-300">
              <span>True Negatives (Approved Good):</span>
              <strong>{cm.tn?.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-cyan-500/10 text-cyan-300">
              <span>True Positives (Identified Risk):</span>
              <strong>{cm.tp?.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-amber-500/10 text-amber-300">
              <span>False Positives (Lost Business):</span>
              <strong>{cm.fp?.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-rose-500/10 text-rose-300">
              <span>False Negatives (Credit Loss):</span>
              <strong>{cm.fn?.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Generalization & Stability */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <span className="text-xs font-mono uppercase text-gray-400 tracking-wider block font-semibold">
            Validation & Generalization
          </span>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Training Score:</span>
              <span className="text-white font-bold">{(tt.train_score * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Testing Score:</span>
              <span className="text-white font-bold">{(tt.test_score * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Train/Test Gap:</span>
              <span className="text-cyber-green font-bold">{(tt.gap * 100).toFixed(2)}% ({tt.status})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">5-Fold CV Mean:</span>
              <span className="text-cyber-blue font-bold">{(cv.mean * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">5-Fold CV Std:</span>
              <span className="text-purple-400 font-bold">±{(cv.std * 100).toFixed(3)}%</span>
            </div>
          </div>
        </div>

        {/* Production Hyperparameters */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <span className="text-xs font-mono uppercase text-gray-400 tracking-wider block font-semibold">
            Model Configuration
          </span>
          <div className="space-y-2 text-xs font-mono">
            {Object.entries(hp).map(([param, val]) => (
              <div key={param} className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-white/5">
                <span className="text-gray-400">{param}:</span>
                <strong className="text-cyber-blue">{String(val)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card3D>
  );
};

export default FinalEvaluationSection;
