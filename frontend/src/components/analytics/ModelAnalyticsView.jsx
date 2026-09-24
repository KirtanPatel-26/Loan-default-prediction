import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Database, Play, BarChart2, GitCommit,
  CheckCircle, Sliders, RefreshCw, AlertTriangle
} from 'lucide-react';

import ModelOverviewCards from './ModelOverviewCards';
import ModelEvaluationSection from './ModelEvaluationSection';
import ConfusionMatrixHeatmap from './ConfusionMatrixHeatmap';
import TrainTestAnalysis from './TrainTestAnalysis';
import CrossValidationSection from './CrossValidationSection';
import ModelComparisonTable from './ModelComparisonTable';
import AdvancedModelsSection from './AdvancedModelsSection';
import HyperparameterTuningSection from './HyperparameterTuningSection';
import FinalEvaluationSection from './FinalEvaluationSection';
import BusinessInterpretationSection from './BusinessInterpretationSection';

import {
  getModelsOverview,
  getModelsList,
  getModelMetrics,
  getConfusionMatrix,
  getModelsComparison,
  getAdvancedModels,
  getFinalEvaluation
} from '../../services/api';

const ModelAnalyticsView = () => {
  const [selectedModel, setSelectedModel] = useState('random_forest');
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [modelsList, setModelsList] = useState([]);
  const [activeMetrics, setActiveMetrics] = useState(null);
  const [activeConfusionMatrix, setActiveConfusionMatrix] = useState(null);
  const [comparisonTable, setComparisonTable] = useState([]);
  const [advancedModels, setAdvancedModels] = useState([]);
  const [finalEval, setFinalEval] = useState(null);

  // Loading & Error States
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingModelData, setLoadingModelData] = useState(false);
  const [error, setError] = useState(null);

  // Load General Overview and Static Comparisons on mount
  useEffect(() => {
    let isMounted = true;
    const fetchGeneralData = async () => {
      setLoadingInitial(true);
      setError(null);
      try {
        const [ovRes, listRes, compRes, advRes] = await Promise.all([
          getModelsOverview(),
          getModelsList(),
          getModelsComparison(),
          getAdvancedModels()
        ]);

        if (isMounted) {
          setOverview(ovRes);
          setModelsList(listRes);
          setComparisonTable(compRes);
          setAdvancedModels(advRes);
        }
      } catch (err) {
        console.error('Failed to fetch general analytics data:', err);
        if (isMounted) {
          setError(err.response?.data?.detail || err.message || 'Error loading model analytics.');
        }
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    fetchGeneralData();
    return () => { isMounted = false; };
  }, []);

  // Fetch active model specific metrics whenever selectedModel changes
  const fetchModelSpecificData = useCallback(async (modelId) => {
    setLoadingModelData(true);
    try {
      const [metRes, cmRes, finRes] = await Promise.all([
        getModelMetrics(modelId),
        getConfusionMatrix(modelId),
        getFinalEvaluation(modelId)
      ]);

      setActiveMetrics(metRes);
      setActiveConfusionMatrix(cmRes);
      setFinalEval(finRes);
    } catch (err) {
      console.error(`Failed to load data for model ${modelId}:`, err);
    } finally {
      setLoadingModelData(false);
    }
  }, []);

  useEffect(() => {
    fetchModelSpecificData(selectedModel);
  }, [selectedModel, fetchModelSpecificData]);

  const activeModelName = modelsList.find(m => m.id === selectedModel)?.name || activeMetrics?.name || 'Selected Model';

  const workflowSteps = [
    { title: 'Dataset', desc: '255k Loan Records', icon: Database },
    { title: 'Training', desc: 'Stratified 80/20', icon: Play },
    { title: 'Evaluation', desc: 'Acc / Prec / Rec / F1', icon: BarChart2 },
    { title: 'Fit Diagnosis', desc: 'Over/Underfitting', icon: GitCommit },
    { title: '5-Fold CV', desc: 'Stability Check', icon: RefreshCw },
    { title: 'Advanced', desc: 'Ensemble Models', icon: Brain },
    { title: 'Tuning', desc: 'Grid / Random Search', icon: Sliders },
    { title: 'Final Review', desc: 'Human-in-the-Loop', icon: CheckCircle },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {/* Title & Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-pink-400 bg-clip-text text-transparent">
            Model Evaluation & Analytics
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto">
          Comprehensive performance evaluation, cross-validation stability analysis, and hyperparameter tuning for Loan Default risk prediction algorithms.
        </p>
      </motion.div>

      {/* Visual Workflow Lifecycle Pipeline */}
      <div className="glass p-5 rounded-2xl border border-white/10 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {workflowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center p-2 rounded-xl group hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-dark-900 border border-white/10 flex items-center justify-center text-cyber-blue mb-1.5 group-hover:border-cyber-blue transition-colors">
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white tracking-wide">{step.title}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{step.desc}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-gray-600 text-xs font-mono">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner if API Fails */}
      {error && (
        <div className="p-4 rounded-2xl glass border border-cyber-red/40 text-cyber-red flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: Top Dashboard Overview Cards */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          1. Portfolio Performance Highlights
        </h2>
        <ModelOverviewCards overview={overview} loading={loadingInitial} error={error} />
      </section>

      {/* SECTION 2: Model Evaluation & Metric Cards */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          2. Model Evaluation & Classification Metrics
        </h2>
        <ModelEvaluationSection
          models={modelsList}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          metricsData={activeMetrics}
          loading={loadingModelData}
        />
      </section>

      {/* SECTION 3: Confusion Matrix Heatmap */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          3. Confusion Matrix & Type I / Type II Error Heatmap
        </h2>
        <ConfusionMatrixHeatmap
          matrixData={activeConfusionMatrix}
          modelName={activeModelName}
        />
      </section>

      {/* SECTION 4 & 5: Train/Test Analysis + 5-Fold Cross Validation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overfitting / Underfitting Analysis */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
            4. Generalization: Overfitting / Underfitting
          </h2>
          <TrainTestAnalysis
            trainTestData={activeMetrics?.train_test}
            modelName={activeModelName}
          />
        </section>

        {/* 5-Fold Cross Validation */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
            5. Robustness: 5-Fold Cross Validation
          </h2>
          <CrossValidationSection
            cvData={activeMetrics?.cross_validation}
            modelName={activeModelName}
          />
        </section>
      </div>

      {/* SECTION 6: Model Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          6. Model Comparison Table (All 5 Algorithms)
        </h2>
        <ModelComparisonTable
          modelsComparison={comparisonTable}
          onSelectModel={setSelectedModel}
        />
      </section>

      {/* SECTION 7: Advanced Models Section (Random Forest, AdaBoost, Gradient Boosting) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          7. Advanced Ensemble Architectures
        </h2>
        <AdvancedModelsSection advancedModels={advancedModels} />
      </section>

      {/* SECTION 8: Hyperparameter Tuning (GridSearchCV / RandomizedSearchCV) */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          8. Hyperparameter Optimization & Before vs After
        </h2>
        <HyperparameterTuningSection />
      </section>

      {/* SECTION 9: Final Model Evaluation Scorecard */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          9. Final Model Evaluation Scorecard
        </h2>
        <FinalEvaluationSection modelData={finalEval} />
      </section>

      {/* SECTION 10: Loan Default Business Interpretation */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          10. Credit Risk Underwriting Interpretation
        </h2>
        <BusinessInterpretationSection />
      </section>
    </div>
  );
};

export default ModelAnalyticsView;
