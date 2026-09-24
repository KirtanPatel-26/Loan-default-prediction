import React from 'react';
import { Landmark, AlertOctagon, CheckCircle2, Users, AlertTriangle, Shield, Scale } from 'lucide-react';
import Card3D from '../3d/Card3D';

const BusinessInterpretationSection = () => {
  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <Landmark className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            Loan Default Business Interpretation
          </h3>
          <p className="text-xs text-gray-400">
            Translating mathematical Machine Learning metrics into enterprise credit risk management decisions
          </p>
        </div>
      </div>

      {/* 4 Core Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* False Positive */}
        <div className="glass p-5 rounded-2xl border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>False Positive (Type I Error) — The Opportunity Cost</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            The system predicts that an applicant <strong>will default</strong>, but the customer <strong>would have repaid in full</strong>.
          </p>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <strong className="text-white">Business Impact: </strong>
            Loss of interest revenue and loan fees. The creditworthy borrower will likely secure financing from a rival bank, reducing the institution's market share.
          </div>
        </div>

        {/* False Negative */}
        <div className="glass p-5 rounded-2xl border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4" />
            <span>False Negative (Type II Error) — The Direct Capital Loss</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            The system predicts that an applicant <strong>will not default</strong>, but the customer <strong>actually defaults</strong> on payments.
          </p>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <strong className="text-white">Business Impact: </strong>
            Direct loss of unpaid loan principal, write-downs, provisioning requirements, and high collection/legal expenses. This error is exponentially more damaging than a Type I error.
          </div>
        </div>

        {/* Precision in Banking */}
        <div className="glass p-5 rounded-2xl border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Precision — Underwriting Confidence</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Measures the percentage of flagged high-risk applicants who genuinely represent defaults.
          </p>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <strong className="text-white">Business Application: </strong>
            High precision ensures underwriters do not needlessly reject viable clients. It instills confidence when denying loans or structuring higher collateral terms.
          </div>
        </div>

        {/* Recall in Banking */}
        <div className="glass p-5 rounded-2xl border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Scale className="w-4 h-4" />
            <span>Recall (Sensitivity) — Default Catch Rate</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Measures how many of the total actual defaults in the loan portfolio were successfully caught.
          </p>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <strong className="text-white">Business Application: </strong>
            High recall safeguards balance sheet solvency by filtering out bad debt before loan origination occurs, serving as an early-warning defense.
          </div>
        </div>
      </div>

      {/* Human in the loop guidance */}
      <div className="p-4 rounded-2xl bg-cyber-blue/5 border border-cyber-blue/20 flex items-start gap-3.5 text-xs text-gray-300">
        <Users className="w-5 h-5 text-cyber-blue shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-1">Human-in-the-Loop Risk Governance Protocol:</strong>
          These statistical models are designed to augment and empower credit risk committees, not replace human judgment. No lending decision should be automatically executed solely from an algorithmic score without verifying borrower documentation, regional economic contexts, and regulatory compliance guidelines.
        </div>
      </div>
    </Card3D>
  );
};

export default BusinessInterpretationSection;
