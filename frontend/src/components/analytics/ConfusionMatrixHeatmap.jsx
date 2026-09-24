import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Info, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import Card3D from '../3d/Card3D';

const ConfusionMatrixHeatmap = ({ matrixData, modelName }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const cm = matrixData?.matrix || {
    tn: 1672,
    fp: 828,
    fn: 762,
    tp: 1738,
    total: 5000,
    tn_rate: 0.6688,
    fp_rate: 0.3312,
    fn_rate: 0.3048,
    tp_rate: 0.6952
  };

  const total = cm.total || (cm.tn + cm.fp + cm.fn + cm.tp);

  const cells = [
    {
      id: 'tn',
      code: 'TN',
      title: 'True Negative',
      count: cm.tn,
      pct: ((cm.tn / total) * 100).toFixed(1),
      actual: 'No Default',
      predicted: 'No Default',
      status: 'Correct Non-Default',
      color: 'text-cyber-green',
      bgColor: 'bg-emerald-500/20 hover:bg-emerald-500/30',
      border: 'border-emerald-500/40',
      icon: ShieldCheck,
      meaning: 'Approved borrowers who successfully repaid their loans without default.',
      loanImpact: 'Healthy loan book, interest income earned, customer loyalty established.'
    },
    {
      id: 'fn',
      code: 'FN',
      title: 'False Negative (Type II Error)',
      count: cm.fn,
      pct: ((cm.fn / total) * 100).toFixed(1),
      actual: 'Default',
      predicted: 'No Default',
      status: 'Missed Default (High Risk)',
      color: 'text-cyber-red',
      bgColor: 'bg-rose-500/25 hover:bg-rose-500/35',
      border: 'border-rose-500/50',
      icon: AlertTriangle,
      meaning: 'Borrower predicted safe, but actually defaulted on the loan.',
      loanImpact: 'Direct capital loss, charge-offs, collection costs, high credit impairment.'
    },
    {
      id: 'fp',
      code: 'FP',
      title: 'False Positive (Type I Error)',
      count: cm.fp,
      pct: ((cm.fp / total) * 100).toFixed(1),
      actual: 'No Default',
      predicted: 'Default',
      status: 'False Alarm (Lost Revenue)',
      color: 'text-cyber-amber',
      bgColor: 'bg-amber-500/20 hover:bg-amber-500/30',
      border: 'border-amber-500/40',
      icon: Info,
      meaning: 'Good borrower predicted to default and rejected or charged higher rates.',
      loanImpact: 'Lost interest income, creditworthy client turns to competitors.'
    },
    {
      id: 'tp',
      code: 'TP',
      title: 'True Positive',
      count: cm.tp,
      pct: ((cm.tp / total) * 100).toFixed(1),
      actual: 'Default',
      predicted: 'Default',
      status: 'Correct Default Identified',
      color: 'text-cyber-blue',
      bgColor: 'bg-cyan-500/20 hover:bg-cyan-500/30',
      border: 'border-cyan-500/40',
      icon: ShieldCheck,
      meaning: 'Defaulter correctly flagged by the model prior to disbursement.',
      loanImpact: 'Mitigated capital loss, protected lending institution from insolvency.'
    }
  ];

  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30">
            <Grid className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Confusion Matrix Heatmap
            </h3>
            <p className="text-xs text-gray-400">
              Evaluated on {total.toLocaleString()} test applicants for {modelName || 'selected model'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" /> Correct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/60" /> Critical Error (FN)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/60" /> Revenue Loss (FP)
          </span>
        </div>
      </div>

      {/* The 2x2 Matrix Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Heatmap Grid */}
        <div className="lg:col-span-7">
          <div className="relative">
            {/* Top Column Labels: Actual Values */}
            <div className="grid grid-cols-2 gap-3 pl-20 pb-2 text-center">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold">
                Actual: No Default
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold">
                Actual: Default
              </div>
            </div>

            {/* Matrix Body with Row Labels on Left */}
            <div className="flex">
              {/* Vertical Row Labels */}
              <div className="flex flex-col justify-around pr-3 w-20 text-right text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold">
                <span className="leading-tight">Predicted<br />No Default</span>
                <span className="leading-tight">Predicted<br />Default</span>
              </div>

              {/* 2x2 Grid Cells */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {cells.map((cell) => {
                  const Icon = cell.icon;
                  const isHovered = hoveredCell?.id === cell.id;
                  return (
                    <div
                      key={cell.id}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${cell.bgColor} ${cell.border} ${
                        isHovered ? 'shadow-2xl ring-2 ring-white/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-dark-900/60 ${cell.color}`}>
                          {cell.code}
                        </span>
                        <Icon className={`w-4 h-4 ${cell.color}`} />
                      </div>

                      <div className="text-3xl font-extrabold font-mono text-white tracking-tight my-1">
                        {cell.count.toLocaleString()}
                      </div>

                      <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                        <span>{cell.pct}% of total</span>
                        <span className="text-[11px] opacity-75 truncate max-w-[90px]">{cell.status.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Cell Inspection & Business Explanations */}
        <div className="lg:col-span-5">
          <div className="glass p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Info className="w-4 h-4 text-cyber-blue" />
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                {hoveredCell ? hoveredCell.title : 'Hover over a cell to inspect'}
              </h4>
            </div>

            {hoveredCell ? (
              <motion.div
                key={hoveredCell.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 text-xs"
              >
                <div>
                  <span className="text-gray-400 font-mono">Classification: </span>
                  <span className="text-white font-semibold">{hoveredCell.status}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-mono">Count: </span>
                  <span className={`font-mono font-bold text-sm ${hoveredCell.color}`}>
                    {hoveredCell.count.toLocaleString()} ({hoveredCell.pct}% of test sample)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-mono">Definition: </span>
                  <p className="text-gray-200 mt-0.5 leading-relaxed">{hoveredCell.meaning}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5">
                  <span className="text-cyber-blue font-mono font-semibold">Banking Impact: </span>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">{hoveredCell.loanImpact}</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                <p>
                  In loan default prediction, <strong className="text-cyber-red">False Negatives (Type II)</strong> represent the highest risk to a financial institution, approving borrowers who ultimately default.
                </p>
                <p>
                  Conversely, <strong className="text-cyber-amber">False Positives (Type I)</strong> create friction by rejecting reliable applicants, dampening interest revenue.
                </p>
                <p className="text-[11px] font-mono text-gray-500">
                  Hover over any quadrant to see counts, rates, and credit risk consequences.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card3D>
  );
};

export default ConfusionMatrixHeatmap;
