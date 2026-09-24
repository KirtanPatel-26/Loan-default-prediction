import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, ArrowUpDown, ChevronDown, ChevronUp, Search, Eye, Filter } from 'lucide-react';
import Card3D from '../3d/Card3D';

const ModelComparisonTable = ({ modelsComparison = [], onSelectModel }) => {
  const [sortField, setSortField] = useState('f1');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter & Sort
  const processedData = useMemo(() => {
    let list = [...modelsComparison];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.model.toLowerCase().includes(q) || m.fit_status.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [modelsComparison, sortField, sortDirection, searchQuery]);

  // Find highest values for each numeric metric to highlight
  const maxValues = useMemo(() => {
    const fields = ['accuracy', 'precision', 'recall', 'f1', 'test_score', 'cv_mean'];
    const maxMap = {};
    fields.forEach(f => {
      if (modelsComparison.length > 0) {
        maxMap[f] = Math.max(...modelsComparison.map(m => m[f] || 0));
      }
    });
    return maxMap;
  }, [modelsComparison]);

  const columns = [
    { key: 'model', label: 'Model' },
    { key: 'accuracy', label: 'Accuracy', numeric: true },
    { key: 'precision', label: 'Precision', numeric: true },
    { key: 'recall', label: 'Recall', numeric: true },
    { key: 'f1', label: 'F1 Score', numeric: true },
    { key: 'train_score', label: 'Train Score', numeric: true },
    { key: 'test_score', label: 'Test Score', numeric: true },
    { key: 'cv_mean', label: 'CV Mean', numeric: true },
    { key: 'cv_std', label: 'CV Std', numeric: true },
  ];

  return (
    <Card3D className="p-6 md:p-8 rounded-3xl border border-white/10">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30">
            <Table className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Comprehensive Model Comparison
            </h3>
            <p className="text-xs text-gray-400">
              Interactive benchmark across all 5 loan default algorithms
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-dark-800/80 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50"
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-dark-800/80 border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`p-3.5 font-mono uppercase tracking-wider text-gray-400 font-semibold cursor-pointer select-none hover:text-white transition-colors ${
                    col.numeric ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 ${col.numeric ? 'justify-end' : 'justify-start'}`}>
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </th>
              ))}
              <th className="p-3.5 font-mono uppercase tracking-wider text-gray-400 font-semibold text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {processedData.map((row) => {
              const isExpanded = expandedRow === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3.5 text-white font-sans font-bold flex items-center gap-2">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                        className="p-1 rounded hover:bg-white/10 text-gray-400"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <span>{row.model}</span>
                    </td>

                    {/* Accuracy */}
                    <td className={`p-3.5 text-right font-medium ${row.accuracy === maxValues.accuracy ? 'text-cyber-green font-bold bg-cyber-green/5' : 'text-gray-300'}`}>
                      {(row.accuracy * 100).toFixed(2)}%
                    </td>

                    {/* Precision */}
                    <td className={`p-3.5 text-right font-medium ${row.precision === maxValues.precision ? 'text-cyan-400 font-bold bg-cyan-400/5' : 'text-gray-300'}`}>
                      {(row.precision * 100).toFixed(2)}%
                    </td>

                    {/* Recall */}
                    <td className={`p-3.5 text-right font-medium ${row.recall === maxValues.recall ? 'text-purple-400 font-bold bg-purple-400/5' : 'text-gray-300'}`}>
                      {(row.recall * 100).toFixed(2)}%
                    </td>

                    {/* F1 */}
                    <td className={`p-3.5 text-right font-medium ${row.f1 === maxValues.f1 ? 'text-pink-400 font-bold bg-pink-400/5' : 'text-gray-300'}`}>
                      {(row.f1 * 100).toFixed(2)}%
                    </td>

                    {/* Train Score */}
                    <td className="p-3.5 text-right text-gray-400">
                      {(row.train_score * 100).toFixed(2)}%
                    </td>

                    {/* Test Score */}
                    <td className={`p-3.5 text-right font-medium ${row.test_score === maxValues.test_score ? 'text-cyber-green font-bold' : 'text-gray-300'}`}>
                      {(row.test_score * 100).toFixed(2)}%
                    </td>

                    {/* CV Mean */}
                    <td className={`p-3.5 text-right font-medium ${row.cv_mean === maxValues.cv_mean ? 'text-emerald-400 font-bold bg-emerald-400/5' : 'text-gray-300'}`}>
                      {(row.cv_mean * 100).toFixed(2)}%
                    </td>

                    {/* CV Std */}
                    <td className="p-3.5 text-right text-gray-400">
                      ±{(row.cv_std * 100).toFixed(3)}%
                    </td>

                    {/* View in Evaluator Button */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onSelectModel(row.id)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-cyber-blue/10 hover:bg-cyber-blue/25 text-cyber-blue border border-cyber-blue/30 transition-all flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3 h-3" /> Select
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Details Row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr className="bg-dark-900/60">
                        <td colSpan={10} className="p-4 border-y border-white/5 font-sans">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 text-xs"
                          >
                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono">Fit Diagnosis:</span>
                                <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                  {row.fit_status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono">Fold Stability:</span>
                                <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                  {row.stability}
                                </span>
                              </div>
                            </div>

                            {/* Hyperparameters List */}
                            <div>
                              <span className="text-gray-400 font-mono text-[11px] uppercase tracking-wider block mb-1.5">
                                Tuned / Configured Hyperparameters:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(row.hyperparameters || {}).map(([param, val]) => (
                                  <span key={param} className="px-2.5 py-1 rounded-md glass text-[11px] font-mono text-gray-300 border border-white/10">
                                    <strong className="text-cyber-blue">{param}:</strong> {String(val)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>* Green highlighted figures indicate highest metric score for that attribute</span>
        <span>Click any column header to toggle ascending/descending order</span>
      </div>
    </Card3D>
  );
};

export default ModelComparisonTable;
