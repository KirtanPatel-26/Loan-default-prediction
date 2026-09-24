import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, GitFork, ArrowRight, Layers, Zap, Sliders, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Card3D from '../3d/Card3D';
import ProButton from '../ui/ProButton';

const AdvancedModelsSection = ({ advancedModels = [] }) => {
  const [activeModalModel, setActiveModalModel] = useState(null);

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyber-purple" />
            Advanced Ensemble Models
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Production-grade ensemble architectures combining multiple estimators for robust default risk boundaries.
          </p>
        </div>
      </div>

      {/* 3 Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {advancedModels.map((m) => {
          const isRF = m.id === 'random_forest';
          const isAda = m.id === 'adaboost';
          const isGB = m.id === 'gradient_boosting';

          const theme = isRF ? {
            tag: 'Bagging (Parallel Trees)',
            tagColor: 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/30',
            glow: 'hover:border-cyber-blue/50'
          } : isAda ? {
            tag: 'Adaptive Boosting (SAMME)',
            tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
            glow: 'hover:border-amber-400/50'
          } : {
            tag: 'Sequential Residual Boosting',
            tagColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
            glow: 'hover:border-purple-400/50'
          };

          return (
            <Card3D key={m.id} className={`p-6 rounded-3xl border border-white/10 ${theme.glow} flex flex-col justify-between h-full`}>
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${theme.tagColor}`}>
                    {theme.tag}
                  </span>
                  <span className="text-xs font-mono text-gray-500">Ensemble</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{m.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {m.description}
                </p>

                {/* Key Hyperparameter Highlights */}
                <div className="p-3.5 rounded-2xl bg-dark-900/60 border border-white/5 space-y-2 mb-6">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    Core Architectural Specs
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-gray-400 text-[11px]">Estimators: </span>
                      <span className="text-white font-bold">{m.hyperparameters?.n_estimators || 80}</span>
                    </div>
                    {m.hyperparameters?.max_depth !== undefined && (
                      <div>
                        <span className="text-gray-400 text-[11px]">Max Depth: </span>
                        <span className="text-white font-bold">{m.hyperparameters.max_depth}</span>
                      </div>
                    )}
                    {m.hyperparameters?.learning_rate !== undefined && (
                      <div>
                        <span className="text-gray-400 text-[11px]">Learning Rate: </span>
                        <span className="text-white font-bold">{m.hyperparameters.learning_rate}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-[11px]">CV Folds: </span>
                      <span className="text-white font-bold">5-Fold</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl glass mb-6">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-mono">Acc</span>
                    <span className="text-xs font-bold font-mono text-cyber-green">
                      {(m.metrics?.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-mono">Prec</span>
                    <span className="text-xs font-bold font-mono text-cyan-400">
                      {(m.metrics?.precision * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-mono">Rec</span>
                    <span className="text-xs font-bold font-mono text-purple-400">
                      {(m.metrics?.recall * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-mono">F1</span>
                    <span className="text-xs font-bold font-mono text-pink-400">
                      {(m.metrics?.f1 * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <ProButton
                onClick={() => setActiveModalModel(m)}
                variant={isRF ? 'primary' : (isAda ? 'secondary' : 'primary')}
                fullWidth={true}
                className="text-xs py-2.5"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                View Details & Flow
              </ProButton>
            </Card3D>
          );
        })}
      </div>

      {/* Model Architectural Details Modal / Drawer */}
      <AnimatePresence>
        {activeModalModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setActiveModalModel(null)}
                className="absolute top-6 right-6 p-2 rounded-xl glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Category */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyber-blue font-semibold">
                  {activeModalModel.type}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {activeModalModel.name}
                </h3>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {activeModalModel.mechanism}
                </p>
              </div>

              {/* Visual Flow Diagram */}
              <div className="p-6 rounded-2xl bg-dark-900/80 border border-white/10 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-cyber-blue" />
                  Algorithm Architectural Flow Diagram
                </span>

                {/* Random Forest Visual Flow: Parallel Trees */}
                {activeModalModel.id === 'random_forest' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                      {[1, 2, 3, 4, 'N'].map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl glass border border-cyber-blue/20">
                          <div className="text-xs font-mono font-bold text-cyber-blue">Tree {t}</div>
                          <div className="text-[10px] text-gray-400 mt-1">Bootstrap Sample {t}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Random Sub-features</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 py-2 text-cyber-blue">
                      <div className="h-px bg-cyber-blue/30 flex-1" />
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full glass border border-cyber-blue/40">
                        Parallel Aggregation / Majority Vote
                      </span>
                      <div className="h-px bg-cyber-blue/30 flex-1" />
                    </div>

                    <div className="text-center p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono font-bold text-sm">
                      🛡️ Final Ensemble Default Prediction
                    </div>
                  </div>
                )}

                {/* AdaBoost Visual Flow: Sequential Stumps */}
                {activeModalModel.id === 'adaboost' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                    <div className="flex-1 p-3 rounded-xl glass border border-amber-400/20">
                      <div className="text-xs font-mono font-bold text-amber-400">Model 1 (Stump)</div>
                      <div className="text-[10px] text-gray-400 mt-1">Initial borrower weights</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl glass border border-amber-400/20">
                      <div className="text-xs font-mono font-bold text-amber-400">Model 2 (Focused)</div>
                      <div className="text-[10px] text-gray-400 mt-1">Amplify misclassified loans</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl glass border border-amber-400/20">
                      <div className="text-xs font-mono font-bold text-amber-400">Model 3 (Refined)</div>
                      <div className="text-[10px] text-gray-400 mt-1">Target edge risk cases</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
                      <div className="text-xs font-mono font-bold">Final Vote</div>
                      <div className="text-[10px] opacity-80 mt-1">Weighted by stump skill</div>
                    </div>
                  </div>
                )}

                {/* Gradient Boosting Visual Flow: Residuals */}
                {activeModalModel.id === 'gradient_boosting' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                    <div className="flex-1 p-3 rounded-xl glass border border-purple-400/20">
                      <div className="text-xs font-mono font-bold text-purple-400">Initial Guess F0</div>
                      <div className="text-[10px] text-gray-400 mt-1">Baseline log-odds</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl glass border border-purple-400/20">
                      <div className="text-xs font-mono font-bold text-purple-400">Tree 1 (Residuals)</div>
                      <div className="text-[10px] text-gray-400 mt-1">Fit gradient of loss</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl glass border border-purple-400/20">
                      <div className="text-xs font-mono font-bold text-purple-400">Tree M (Residuals)</div>
                      <div className="text-[10px] text-gray-400 mt-1">Step size learning rate</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
                      <div className="text-xs font-mono font-bold">Fm(x) Optimized</div>
                      <div className="text-[10px] opacity-80 mt-1">Minimized risk error</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hyperparameter Deep Dive */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Key Hyperparameters Explained
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeModalModel.key_hyperparameters || []).map((hp) => (
                    <div key={hp.name} className="p-3.5 rounded-xl glass border border-white/5 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <strong className="text-cyber-blue">{hp.name}</strong>
                        <span className="text-gray-400">Default: {String(hp.default)}</span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">{hp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-dark-900/60 border border-white/10 font-mono">
                <div>
                  <span className="text-gray-400 text-xs">Train Score</span>
                  <div className="text-lg font-bold text-white">
                    {(activeModalModel.train_test?.train_score * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Test Score</span>
                  <div className="text-lg font-bold text-cyber-green">
                    {(activeModalModel.train_test?.test_score * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">5-Fold CV Mean</span>
                  <div className="text-lg font-bold text-cyan-400">
                    {(activeModalModel.cross_validation?.mean * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Diagnosis</span>
                  <div className="text-xs font-bold text-yellow-400 mt-1">
                    {activeModalModel.train_test?.status}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedModelsSection;
