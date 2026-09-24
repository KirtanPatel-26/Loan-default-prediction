import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './components/cursor/CustomCursor'
import Header from './components/navigation/Header'
import PredictionForm from './components/dashboard/PredictionForm'
import ResultGauge from './components/dashboard/ResultGauge'
import RiskBreakdown from './components/dashboard/RiskBreakdown'
import InsightsView from './components/dashboard/InsightsView'
import ModelAnalyticsView from './components/analytics/ModelAnalyticsView'
import RiskCoreScene from './components/3d/RiskCoreScene'
import Card3D from './components/3d/Card3D'
import { predictRisk } from './services/api'
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

function App() {
  const [activeTab, setActiveTab] = useState('prediction')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handlePredict = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await predictRisk(formData)
      setResult(data)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to get prediction. Make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Build risk factors for display
  const riskFactors = result?.risk_factors?.map((factor, i) => ({
    factor: factor.split(':')[0] || factor.split(',')[0] || factor.substring(0, 50),
    impact: result.risk_level === 'LOW' ? 'positive' : result.risk_level === 'HIGH' ? 'negative' : 'neutral',
    detail: factor,
  })) || []

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyber-blue/5 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyber-purple/5 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyber-pink/3 blur-[100px] animate-pulse-glow" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ============ PREDICTION TAB ============ */}
          {activeTab === 'prediction' && (
            <motion.div
              key="prediction"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Hero section */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="glow-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                    Risk Assessment
                  </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Predict financial risk before it happens using Machine Learning.
                  Fill in the applicant details below or choose a preset profile.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section — takes 2 columns */}
                <div className="xl:col-span-2">
                  <PredictionForm onPredict={handlePredict} loading={loading} />
                </div>

                {/* Results & 3D Scene — right column */}
                <div className="space-y-6">
                  {/* 3D Risk Core */}
                  <Card3D className="overflow-hidden">
                    <div className="p-1">
                      <h3 className="text-sm font-mono text-gray-400 px-4 pt-3 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4 text-cyber-blue" />
                        Risk Visualization
                      </h3>
                      <RiskCoreScene
                        riskLevel={result?.probability || 0}
                        isActive={result !== null}
                      />
                    </div>
                  </Card3D>

                  {/* Error display */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass p-4 border border-cyber-red/30"
                      >
                        <div className="flex items-center gap-3 text-cyber-red">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Result Gauge */}
                  <ResultGauge
                    probability={result?.probability || 0}
                    prediction={result?.prediction || 0}
                    riskLevel={result?.risk_level || 'LOW'}
                    creditHealth={result?.credit_health || '—'}
                    isVisible={result !== null}
                  />

                  {/* Risk Breakdown */}
                  <RiskBreakdown
                    riskFactors={riskFactors}
                    isVisible={result !== null && riskFactors.length > 0}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ INSIGHTS TAB ============ */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <InsightsView />
            </motion.div>
          )}

          {/* ============ MODEL ANALYTICS TAB ============ */}
          {activeTab.toLowerCase() === 'analytics' && (
            <motion.div
              key="analytics"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ModelAnalyticsView />
            </motion.div>
          )}

          {/* ============ ABOUT TAB ============ */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-10"
                >
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                    About LoanShield AI
                  </h1>
                </motion.div>

                <div className="space-y-6">
                  <Card3D>
                    <div className="p-8">
                      <h2 className="text-xl font-semibold text-cyber-blue mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Model Information
                      </h2>
                      <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass p-4 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Algorithm</p>
                            <p className="text-lg font-mono text-cyber-blue mt-1">Logistic Regression</p>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Features</p>
                            <p className="text-lg font-mono text-cyber-green mt-1">24</p>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Target</p>
                            <p className="text-lg font-mono text-cyber-amber mt-1">Default</p>
                          </div>
                          <div className="glass p-4 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Split</p>
                            <p className="text-lg font-mono text-cyber-pink mt-1">80/20</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card3D>

                  <Card3D>
                    <div className="p-8">
                      <h2 className="text-xl font-semibold text-cyber-purple mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Purpose
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        Predict whether an applicant is likely to default on a loan
                        based on financial and demographic factors. The model analyzes
                        24 features including credit score, income, employment status,
                        and debt-to-income ratio to produce a default probability.
                      </p>
                    </div>
                  </Card3D>

                  <Card3D>
                    <div className="p-8">
                      <h2 className="text-xl font-semibold text-cyber-green mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Technology Stack
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {['Python', 'Pandas', 'Scikit-Learn', 'FastAPI', 'React', 'Three.js', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 glass rounded-full text-sm font-mono text-gray-300 border border-white/10 hover:border-cyber-blue/50 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5">
        <p className="text-gray-600 text-sm font-mono">
          LoanShield AI v2.0 — Powered by Machine Learning & 3D Visualization
        </p>
      </footer>
    </div>
  )
}

export default App
