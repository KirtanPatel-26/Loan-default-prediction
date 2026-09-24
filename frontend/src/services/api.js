import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawBase.endsWith('/api') 
  ? rawBase 
  : (rawBase === '/api' ? '/api' : `${rawBase.replace(/\/+$/, '')}/api`);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictRisk = async (applicantData) => {
  const response = await api.post('/predict', applicantData);
  return response.data;
};

export const getPresets = async () => {
  const response = await api.get('/presets');
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/model-info');
  return response.data;
};

// ==========================================
// TASK 5: MODEL EVALUATION & ANALYTICS APIS
// ==========================================

export const getModelsOverview = async () => {
  const response = await api.get('/models/overview');
  return response.data;
};

export const getModelsList = async () => {
  const response = await api.get('/models');
  return response.data;
};

export const getModelMetrics = async (modelId) => {
  const response = await api.get(`/models/${modelId}/metrics`);
  return response.data;
};

export const getConfusionMatrix = async (modelId) => {
  const response = await api.get(`/models/${modelId}/confusion-matrix`);
  return response.data;
};

export const getModelsComparison = async () => {
  const response = await api.get('/models/comparison');
  return response.data;
};

export const getAdvancedModels = async () => {
  const response = await api.get('/models/advanced');
  return response.data;
};

export const tuneModel = async (tuningConfig) => {
  const response = await api.post('/models/tune', tuningConfig);
  return response.data;
};

export const getTuningComparison = async (modelId) => {
  const response = await api.get(`/models/${modelId}/tuning-comparison`);
  return response.data;
};

export const getFinalEvaluation = async (modelId) => {
  const response = await api.get(`/models/${modelId}/final-evaluation`);
  return response.data;
};

export default api;
